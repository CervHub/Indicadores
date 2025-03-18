<script src="https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js"></script>
<script>
    $(document).ready(function() {
        $('#report').addClass('active');

        // Agregar atributo data-fancybox a las imágenes con la clase agrandar
        $('.agrandar').each(function() {
            var src = $(this).attr('src');
            var caption = $(this).attr('alt') ||
                ''; // Usar el atributo alt como caption si está disponible
            $(this).wrap('<a href="' + src + '" data-fancybox="gallery" data-caption="' + caption +
                '"></a>');
        });

        // Inicializar Fancybox con la opción de zoom habilitada
        Fancybox.bind('[data-fancybox]', {

        });
    });
</script>
