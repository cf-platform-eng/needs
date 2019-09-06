Feature: Validating json files with jsonschema
  Scenario: Failing need
    Given a needs file that checks for a json file with a schema
    And that file does not exist
    When I check the needs
    Then the needs check fails

  Scenario: Not valid jsonschema
    Given a needs file that checks for a json file with an invalid schema
    When I list the needs
    Then the needs list fails

  Scenario: File not valid json
    Given a needs file that checks for a json file with a schema
    And that file is not json
    When I check the needs
    Then the needs check fails

  Scenario: Schema check fails
    Given a needs file that checks for a json file with a schema
    And that file does not meet the schema
    When I check the needs
    Then the needs check fails

  Scenario: Schema check passes
    Given a needs file that checks for a json file with a schema
    And that file meets the schema
    When I check the needs
    Then the needs check passes
