const AFRAME = globalThis.AFRAME;

if ( typeof AFRAME === "undefined" )
{
    throw new Error(
        "Component attempted to register before AFRAME was available."
    );
}

AFRAME.registerComponent( "stress-test", {

    schema:
    {
        boxCount: { type: "number", default: 200 },
        textureWidth: { type: "number", default: 1024 },
        textureHeight: { type: "number", default: 1024 },

        xPositionRange: { type: "number", default: 20 },

        yPositionRange: { type: "number", default: 5 },
        cubeHeight: { type: "number", default: 1 },

        zPositionRange: { type: "number", default: 3 },
        zPositionOffset: { type: "number", default: -6 },

        textWidthScalar: { type: "number", default: 0.15625 },
        textHeightScalar: { type: "number", default: 0.625 },

        videoSelector: { type: "selector", default: "#video" },
        anisotropy: { type: "number", default: 16 },
        transparent: { type: "boolean", default: true },
        opacity: { type: "number", default: 0.8 }
    },

    init: function()
    {
        this.updateSchemaFromUrlParameters();
    },

    play: function()
    {
        document.querySelector( "a-video" )
            .object3D.renderOrder = 1;

        this.stressTestScene(
            this.data.boxCount,
            this.data.textureWidth,
            this.data.textureHeight
        );

        this.playAllVideos();
    },

    updateSchemaFromUrlParameters: function()
    {
        const urlParameters = new URLSearchParams( window.location.search );

        // NOTE: Loop through the schema keys and update
        // values if URL param exists.
        Object.keys( this.schema ).forEach(
            ( key ) =>
                {
                    if ( urlParameters.has( key ) )
                    {
                        const type = this.schema[ key ].type;

                        let value = urlParameters.get( key );

                        // NOTE: Coerce to correct type.
                        if ( type === "number" ) value = parseFloat( value );
                        if ( type === "boolean" ) value = value === "true";

                        // NOTE: Update component data.
                        this.data[ key ] = value;
                    }
            }
        );

        // NOTE: Apply the updated data to the entity or use
        // it as needed.
        this.applyAttributes();
    },

    applyAttributes: function()
    {
        this.el.setAttribute( "boxCount", `${ this.data.boxCount }` );
        this.el.setAttribute( "textureWidth", `${ this.data.boxCount }` );
        this.el.setAttribute( "textureHeight", `${ this.data.boxCount }` );

        console.debug( "Configured attributes:", this.data );
    },

    stressTestScene: function( numberOfObjects, textureWidth, textureHeight)
    {
        const scene = document.querySelector( "a-scene" );

        for ( let i = 0; i < numberOfObjects; i++ )
        {
            const box = document.createElement( "a-box" );

            // NOTE: Get random positions.
            const x = ( Math.random() * this.data.xPositionRange )
                - ( this.data.xPositionRange * 0.5 );

            const y = Math.max(
                Math.random() * this.data.yPositionRange,
                this.data.cubeHeight
            );

            const z = ( Math.random() * -this.data.zPositionRange )
                + this.data.zPositionOffset;

            box.setAttribute( "position", `${ x } ${ y } ${ z }` );

            const textureUrl =
                this.generateUniqueTexture( i, textureWidth, textureHeight );

            // NOTE: Assign a unique color to ensure unique
            // material and draw call.
            const randomHexColor = this.getRandomHexColor();

            // TIP: Comment in/out maps to add/remove scene
            // rendering complexity.
            box.setAttribute(
                "material",
                `color: ${ randomHexColor };`
                + `src: ${ this.data.videoSelector.src };`
                // + `normalMap: url( ${ textureUrl } );`
                + `roughnessMap: url( ${ textureUrl } );`
                // + `metalnessMap: url( ${ textureUrl } );`
                // + `sphericalEnvMap: url( ${ textureUrl } );`
                + `anisotropy: ${ this.data.anisotropy };`
                + `transparent: ${ this.data.transparent };`
                + `opacity: ${ this.data.opacity };`
            );

            console.debug( `material ${ i }:`, box.getAttribute( "material" ) );
            
            scene.appendChild( box );
        }
    },

    generateUniqueTexture: function( iteration, textureWidth, textureHeight )
    {
        // NOTE: Create a canvas and draw something unique
        // (e.g., colored background + text).
        const canvas = document.createElement( "canvas" );

        canvas.width = textureWidth;
        canvas.height = textureHeight;

        const canvasContext = canvas.getContext( "2d" );

        canvasContext.fillStyle = this.getRandomHexColor();

        canvasContext.fillRect( 0, 0, canvas.width, canvas.height );

        // NOTE: Draw the index for uniqueness.
        canvasContext.fillStyle = "#ffffff";

        canvasContext.font =
            `bold ${ textureWidth * 0.5 }px sans-serif`;

        canvasContext.fillText(
            iteration,
            textureWidth * this.data.textWidthScalar,
            textureWidth * this.data.textHeightScalar
        )

        // NOTE: Export as data URL.
        return canvas.toDataURL();
    },

    playAllVideos: function()
    {
        console.debug( "playAllVideos() is called." );

        document.querySelectorAll ( "video" ).forEach(
            ( video ) =>
            {
                video.addEventListener(
                    "playing",
                    () =>
                    {
                        console.debug(
                            "Video is playing:",
                            video
                        );
                    }
                );

                video.addEventListener(
                    "paused",
                    () =>
                    {
                        console.debug(
                            "Video is paused:",
                            video
                        );
                    }
                );

                if ( video.paused )
                {
                    console.debug(
                        "Video is paused:",
                    video
                    );

                    video.play();
                }
            }
        );
    },

    getRandomHexColor: function()
    {
        const letters = "0123456789ABCDEF";
        let color = "#";

        for ( let i = 0; i < 6; i++)
        {
            color += letters[ Math.floor( Math.random() * 16 ) ];
        }

        return color;
    }

} );