Feature: Identify
  Scenario: Identify only called with --identify
    Given a needs file with an identify field
    And the needs are satisfied
    When I check the needs
    Then the needs check passes
    And the identity command was not called
    And the identity field is not populated

  Scenario: Identify only called for satisfied needs
    Given a needs file with an identify field
    And the needs are not satisfied
    When I check the needs with --identify
    Then the needs check fails
    And the identity command was not called
    And the identity field is not populated

  Scenario: Identify works
    Given a needs file with an identify field
    And the needs are satisfied
    When I check the needs with --identify
    Then the needs check passes
    And the identity command was called
    And the identity field is populated

  Scenario: Identify fails
    Given a needs file with a failing identify field
    And the needs are satisfied
    When I check the needs with --identify
    Then the needs check passes
    And the identity command was called
    And the identity field is populated with an error
