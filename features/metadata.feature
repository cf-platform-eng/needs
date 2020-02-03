Feature: Metadata
  Scenario: Using `list`
    Given a needs file with a metadata field
    When I list the needs
    Then the needs list passes
    And I see the metadata in the output

  Scenario: Using `check`
    Given a needs file with a metadata field
    When I check the needs
    Then the needs check passes
    And I see the metadata in the output

  Scenario: Using `list` with invalid metadata
    Given a needs file with an invalid metadata field
    When I list the needs
    Then the needs list fails

