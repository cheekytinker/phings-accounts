Feature: User signs up for an account
  As a user of phings
  I want to sign up for an account
  So that I can interact with the application

  Scenario: Successful signup
    Given an account named '<autogenerate>'
    And the Primary Contact email is 'anthony.hollingsworth@elateral.com'
    When a create account signup request is made
    And the response is 201 'Account "<accountName>" created'
    And an account verification email is received on the Primary Contact email
    And the verify account request is made
    And the response is 200 'Account "<accountName>" verification submitted'
    Then we expect an account signup complete email to arrive at the Primary Contact email

  Scenario: Attempt to signup for account that is already taken
    Given an account named '<autogenerate>'
    And the Primary Contact email is 'anthony.hollingsworth@elateral.com'
    When a create account signup request is made
    And the response is 201 'Account "<accountName>" created'
    And a create account signup request is made
    And the response to be 400 'Error "Account Already Exists"'

  Scenario: Attempt to signup really quickly for account that is already taken
    Given an account named '<autogenerate>'
    And the Primary Contact email is 'anthony.hollingsworth@elateral.com'
    When a create account signup request is made
    And a create account signup request is made
    And the response to be 400 'Error "Account Already Exists"'

