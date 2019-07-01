Feature: Listing needs
  Scenario: Valid needs file
    Given a needs file
    When I list the needs
    Then I see the list of needs

  Scenario: Missing needs file
    Given no needs file
    When I list the needs
    Then the needs list fails
    And tells me that the needs file was missing

  Scenario: Invalid needs file
    Given a needs file with invalid data
    When I list the needs
    Then the needs list fails
    And tells me that the needs file was invalid