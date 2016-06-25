Feature: Conversation parsing using Wit.Ai
  As user I want to be able to create an expense based on a bot chat

  Scenario: Saving a simple expense
    Given I'm a random facebook user
    When I send the message I spent $20 in Supermarket
    And Confirm my expense
    Then It should create a new Expense with type Supermarket and amount of 20
  
   Scenario: Cancel an expense
    Given I'm a random facebook user
    When I send the message I spent $20 in Supermarket
    And Cancel my expense
    Then It should not create a new Expense

  Scenario: Two expenses are sent in a row
    Given I'm a random facebook user
    When I send the message I spent $20 in Supermarket
    When I send the message Wrong Message
    And I send the message I spent $30 in Pharmacy
    And Confirm my expense
    Then It should create a new Expense with type Pharmacy and amount of 30

  Scenario: Wrong expense message is sent
    Given I'm a random facebook user
    When I send the message I WRONG $20 in Supermarket
    Then It should not create a new Expense