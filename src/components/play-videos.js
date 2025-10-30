const AFRAME = globalThis.AFRAME;

if ( typeof AFRAME === "undefined" )
{
    throw new Error(
        "Component attempted to register before AFRAME was available."
    );
}

AFRAME.registerComponent( "play-videos", {

    init: function()
    {
        document.querySelector( "a-scene" ).addEventListener(
            "loaded",
            () =>
            {
                console.debug( "A-Frame scene is loaded." );

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

                document.querySelector( "a-video" )
                    .object3D.renderOrder = 1;
            }
        )
    }

} );