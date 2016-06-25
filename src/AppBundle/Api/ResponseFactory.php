<?php
/**
 * Created by PhpStorm.
 * User: jimspete
 * Date: 2016/5/14
 * Time: 14:28
 */

namespace AppBundle\Api;

use Symfony\Component\HttpFoundation\JsonResponse;

class ResponseFactory
{
  public function createResponse(ApiProblem $apiProblem)
  {
    $data = $apiProblem->toArray();
    // making type a URL, to a temporarily fake page
    if ($data['type'] != 'about:blank') {
      $data['type'] = 'http://localhost:8000/docs/errors#'.$data['type'];
    }
    $response = new JsonResponse(
      $data,
      $apiProblem->getStatusCode()
    );

    $response->headers->set('Content-Type', 'application/problem+json');

    return $response;
  }
}