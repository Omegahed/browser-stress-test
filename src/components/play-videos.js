const AFRAME = globalThis.AFRAME;

if ( typeof AFRAME === "undefined" )
{
    throw new Error(
        "Component attempted to register before AFRAME was available."
    );
}

AFRAME.registerComponent( "play-videos", {

    play: function()
    {
        document.querySelectorAll ( "video" ).forEach(
            ( video ) =>
            {
                video.play();
            }
        );

        document.querySelector( "a-video" ).object3D.renderOrder = 1;
    },

} );