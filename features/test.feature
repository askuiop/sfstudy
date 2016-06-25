Feature: Search
  In order to find products dinosaurs love
  As a website user
  I need to be able to search for products

  #@javascript
  Scenario: Search for a word that exists
    Given I am on "/login"
    Then I should see "Login"