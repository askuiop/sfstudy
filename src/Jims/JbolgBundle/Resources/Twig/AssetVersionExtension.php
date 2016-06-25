<?php
/**
 * Created by PhpStorm.
 * User: jimspete
 * Date: 2016/6/10
 * Time: 18:24
 */

namespace Jims\JbolgBundle\Resources\Twig;


class AssetVersionExtension extends \Twig_Extension
{
    /**
     * @var
     */
    private $appDir;

    public function __construct($appDir)
    {

        $this->appDir = $appDir;
    }

    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('asset_version', array($this, 'getAssetVersion')),

        );
    }

    public function getAssetVersion($filename)
    {
        $manifestPath = $this->appDir.'/../src/Jims/JbolgBundle/Resources/assets/rev-manifest.json';
        if (!file_exists($manifestPath)) {
            throw new \Exception(sprintf('Cannot find manifest file: "%s"', $manifestPath));
        }
        $paths = json_decode(file_get_contents($manifestPath), true);
        if (!isset($paths[$filename])) {
            throw new \Exception(sprintf('There is no file "%s" in the version manifest!', $filename));
        }
        return $paths[$filename];
    }


    public function getName()
    {
        return 'asset_version';
    }


}