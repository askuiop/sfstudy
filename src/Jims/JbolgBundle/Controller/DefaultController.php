<?php

namespace Jims\JbolgBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('JimsJbolgBundle:Default:index.html.twig');
    }

    public function postAction()
    {

        return $this->render('JimsJbolgBundle:Default:post.html.twig');
    }

}
