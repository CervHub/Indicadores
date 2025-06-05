<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;
    protected $fillable = [
        'fecha_reporte',
        'fecha_evento',
        'descripcion',
        'correctiva',
        'gravedad',
        'probabilidad',
        'exposicion',
        'otros',
        'mapa_cordenadas',
        'firma',
        'estado',
        'user_id',
        'reporte_usuarios_ids',
        'tipo_reporte',
        'company_id',
        'images',
        'levels',
        'category_company_id',
        'comentario',
        'lugar',
        'details',
        'tipo_inspeccion',
        'send_email',
        'company_report_id',
        'device',
        'version',
        'vehicle_plate',
        'vehicle_status',
        'mileage',
        'area',
        'user_report_id',
        'delete_reason',
        'reassigned_user_id',
        'reassignment_reason',
        'deleted_at',
        'entity_id',
        'report_closed_at'
    ];

    public function getGerenciaIdAttribute()
    {
        return json_decode($this->levels)->gerencia ?? null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function categoryCompany()
    {
        return $this->belongsTo(CategoryCompany::class);
    }

    public function categoryCompanyName()
    {
        $name = optional($this->categoryCompany)->nombre;
        return strpos($name, '-') === false ? $name : null;
    }
    public function imagesP()
    {
        $images = json_decode($this->images, true);
        $images = $images ?? null; // Accede al primer elemento del array

        $result = [];
        $count = 1;

        if ($images) {
            foreach ($images as $key => $base64) {
                // Redimensionar, recortar y rotar la imagen
                $processedBase64 = $this->processImage($base64, -90, 16, 9); // Gira la imagen 90 grados y la ajusta a 9:16
                $result['Imagen ' . str_pad($count, 2, '0', STR_PAD_LEFT)] = $processedBase64;
                $count++;
            }
        }

        return $result;
    }

    public function imagesPI()
    {
        $details = json_decode($this->details, true);
        if (!is_array($details)) {
            $details = [];
        }
        foreach ($details as $key => &$detail) {
            if (isset($detail['fotos']) && is_string($detail['fotos'])) {
                $detail['fotos'] = json_decode($detail['fotos'], true);
            }
            if (isset($detail['fotos']) && is_array($detail['fotos'])) {
                $fotos = $detail['fotos'];
                $processedFotos = [];
                $count = 1;
                foreach ($fotos as $foto) {
                    if (is_array($foto) && isset($foto['base64'])) {
                        // Obtener las dimensiones de la orientación
                        $resolution = $foto['orientacion'];
                        $dimensions = explode('x', $foto['orientacion']);

                        if (count($dimensions) == 1) {
                            if ($dimensions[0] === 'Vertical') {
                                $dimensions = ['1080', '1920', 'Galeria'];
                            } else {
                                $dimensions = ['1920', '1080', 'Galeria'];
                            }
                        }
                        $width = isset($dimensions[0]) ? (int)$dimensions[0] : 1080; // Valor por defecto si no se encuentra
                        $height = isset($dimensions[1]) ? (int)$dimensions[1] : 1920; // Valor por defecto si no se encuentra
                        $source = isset($dimensions[2]) ? $dimensions[2] : 'Galeria'; // Valor por defecto si no se encuentra

                        // Determinar el ángulo de rotación
                        $rotationAngle = ($source === 'Camara') ? 90 : 0;

                        if ($resolution === '1920x1080xCamara') {
                            $rotationAngle = 0;
                        }

                        // Procesar la imagen
                        $stretchedImage = $this->stretchImage($foto['base64'], $width, $height, $rotationAngle);

                        // Crear el array procesado
                        $processedFoto = [
                            'orientacion' => $foto['orientacion'],
                            'base64' => $stretchedImage,
                        ];
                        $processedFotos['Foto ' . str_pad($count, 2, '0', STR_PAD_LEFT)] = $processedFoto;
                        $count++;
                    }
                }
                // Reemplazar las fotos originales con las procesadas
                $detail['fotos'] = $processedFotos;
            }
        }
        unset($detail); // Romper la referencia después del bucle

        return $details;
    }

    private function processImage($base64Image, $angle, $newWidthRatio, $newHeightRatio)
    {
        // Decodificar la imagen de Base64
        $imageData = base64_decode($base64Image);
        $sourceImage = imagecreatefromstring($imageData);

        if ($sourceImage === false) {
            return $base64Image; // Si la imagen no se puede crear, devolver la original
        }

        // Obtener dimensiones originales
        $width = imagesx($sourceImage);
        $height = imagesy($sourceImage);

        // Calcular nuevas dimensiones manteniendo la relación de aspecto 9:16
        $newHeight = $height;
        $newWidth = intval($newHeight * $newWidthRatio / $newHeightRatio);

        if ($newWidth > $width) {
            $newWidth = $width;
            $newHeight = intval($newWidth * $newHeightRatio / $newWidthRatio);
        }

        // Redimensionar la imagen a las nuevas dimensiones
        $resizedImage = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($resizedImage, $sourceImage, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        // Crear una imagen final con la relación de aspecto deseada
        $finalImage = imagecreatetruecolor($newWidth, $newHeight);
        $backgroundColor = imagecolorallocate($finalImage, 0, 0, 0); // Color de fondo negro (puedes cambiarlo)
        imagefill($finalImage, 0, 0, $backgroundColor);

        // Copiar la imagen redimensionada al centro de la nueva imagen
        imagecopy($finalImage, $resizedImage, 0, 0, 0, 0, $newWidth, $newHeight);

        // Rotar la imagen final
        $rotatedImage = imagerotate($finalImage, $angle, 0);

        // Capturar la imagen rotada en una variable
        ob_start();
        imagepng($rotatedImage);
        $imageData = ob_get_contents();
        ob_end_clean();

        // Liberar memoria
        imagedestroy($sourceImage);
        imagedestroy($resizedImage);
        imagedestroy($finalImage);
        imagedestroy($rotatedImage);

        // Codificar la imagen rotada a Base64
        return base64_encode($imageData);
    }

    public function responsable()
    {
        $reporteUsuariosIds = json_decode($this->reporte_usuarios_ids, true);
        $reporteUsuariosIds = $reporteUsuariosIds ?? null; // Accede al primer elemento del array

        $jefeId = $reporteUsuariosIds['jefe'] ?? null;
        if ($jefeId) {
            $responsable = User::find($jefeId);
            return $responsable ? $responsable->nombres . ' ' . $responsable->apellidos : '-';
        }

        return '-';
    }

    public function reportado()
    {
        $usuario_id = $this->user_id;
        $usuario = User::find($usuario_id);
        return $usuario ? $usuario->nombres . ' ' . $usuario->apellidos : '-';
    }

    public function levels()
    {
        $levels = json_decode($this->levels, true);
        $levels = $levels ?? null;

        $result = [];

        if ($levels) {
            foreach ($levels as $level => $id) {
                if ($id !== '') { // Verificar si el ID no es una cadena vacía
                    $entity = Entity::find($id); // Asume que tienes un modelo Entity
                    if ($entity) {
                        $result[$level] = $entity->nombre; // Asume que el nombre se almacena en la propiedad 'nombre'
                    }
                } else {
                    $result[$level] = '-';
                }
            }
        }

        return $result;
    }

    public function levels2()
    {
        $levels = json_decode($this->reporte_usuarios_ids, true);
        $levels = $levels ?? null;

        $result = [];

        if ($levels) {
            foreach ($levels as $level => $id) {
                $user = User::find($id); // Busca en el modelo User
                if ($user) {
                    $result[$level] = $user->nombres . ' ' . $user->apellidos; // Asume que el nombre y apellido se almacenan en las propiedades 'nombres' y 'apellidos'
                }
            }
        }

        return $result;
    }

    public function moduleReview()
    {
        return $this->hasOne(ModuleReview::class);
    }

    public function imagenes()
    {
        $images = json_decode($this->images, true);
        $keys = array_keys($images);

        $result = [];

        foreach ($keys as $key) {
            if (strpos($key, 'image') !== false) {
                $resKey = str_replace('image', 'res', $key);
                $resolution = $images[$resKey] ?? '1080x1920xGaleria';
                $parts = explode('x', $resolution);

                $width = $parts[0] ?? 1080;
                $height = $parts[1] ?? 1920;
                $source = $parts[2] ?? 'Galeria'; // Default to 'Galeria' if not specified


                $rotationAngle = ($source === 'Camara') ? 90 : 0;

                if ($resolution === '1920x1080xCamara') {
                    $rotationAngle = 0;
                }

                $base64Image = $images[$key];
                $stretchedImage = $this->stretchImage($base64Image, $width, $height, $rotationAngle);

                $result[] = [
                    'img' => $stretchedImage,
                    'res' => $resolution
                ];
            }
        }

        return $result;
    }

    private function stretchImage($base64Image, $width, $height, $rotationAngle = 0)
    {
        try {
            // Validate dimensions
            // if ($width <= 0 || $height <= 0) {
            //     dd($width, $height);
            // }

            // Decode the base64 image
            $imageData = base64_decode($base64Image);
            $sourceImage = imagecreatefromstring($imageData);

            // Rotate the image if the angle is not zero
            if ($rotationAngle != 0) {
                $sourceImage = imagerotate($sourceImage, -$rotationAngle, 0); // Negative for clockwise rotation
            }

            $width = $width === '' ? 1920 : $width;
            $height = $height === '' ? 1080 : $height;

            // Create a new true color image with the specified dimensions
            $stretchedImage = imagecreatetruecolor($width, $height);

            // Copy and resize the old image into the new image
            imagecopyresampled($stretchedImage, $sourceImage, 0, 0, 0, 0, $width, $height, imagesx($sourceImage), imagesy($sourceImage));

            // Capture the output
            ob_start();
            imagepng($stretchedImage);
            $imageData = ob_get_contents();
            ob_end_clean();

            // Free up memory
            imagedestroy($sourceImage);
            imagedestroy($stretchedImage);

            // Return the new base64 image
            return base64_encode($imageData);
        } catch (Exception $e) {
            // Handle the error
            return null;
        }
    }
}
