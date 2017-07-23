Feature: User signs up for an account
  As a user of phings
  I want to sign up for an account
  So that I can interact with the application

  Scenario: Successful signup
    Given an account named "<autogenerate>"
    And the Primary Contact email is "anthony.hollingsworth@elateral.com"
    When a create account signup request is made
    And an account verification email is received on the Primary Contact email
    When the verify account request is made
    Then we expect an account signup complete email to arrive at the Primary Contact email
