<?php
/**
 * Created by PhpStorm.
 * User: jimspete
 * Date: 2016/5/14
 * Time: 10:25
 */

namespace Tests\AppBundle\Controller\Api;

use AppBundle\Test\ApiTestCase;

class TokenControllerTest extends ApiTestCase
{
  public function testPOSTCreateToken()
  {
    $this->createUser('weaverryan', 'I<3Pizza');
    $response = $this->client->post('/api/tokens', [
      'auth' => ['weaverryan', 'I<3Pizza']
    ]);
    $this->assertEquals(200, $response->getStatusCode());
    $this->asserter()->assertResponsePropertyExists(
      $response,
      'token'
    );
  }

  public function testPOSTTokenInvalidCredentials()
  {
    $this->createUser('weaverryan', 'I<3Pizza');
    $response = $this->client->post('/api/tokens', [
      'auth' => ['weaverryan', 'IH8Pizza']
    ]);
    $this->assertEquals(401, $response->getStatusCode());
    $this->assertEquals('application/problem+json', $response->getHeader('Content-Type')[0]);
    $this->asserter()->assertResponsePropertyEquals($response, 'type', 'about:blank');
    $this->asserter()->assertResponsePropertyEquals($response, 'title', 'Unauthorized');
    $this->asserter()->assertResponsePropertyEquals($response, 'detail', 'Invalid credentials.');
  }

  public function testBadToken()
  {
    $response = $this->client->post('/api/programmers', [
      'body' => '[]',
      'headers' => [
        'Authorization' => 'Bearer WRONG'
      ]
    ]);
    $this->assertEquals(401, $response->getStatusCode());
    $this->assertEquals('application/problem+json', $response->getHeader('Content-Type')[0]);
    $this->debugResponse($response);



  }
}