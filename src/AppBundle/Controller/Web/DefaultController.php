<?php

namespace AppBundle\Controller\Web;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use AppBundle\Controller\BaseController;

class DefaultController extends BaseController
{
    /**
     * @Route("/", name="homepage")
     */
    public function homepageAction()
    {
        $kk =22222;
        return $this->render('homepage.twig');
    }
}
