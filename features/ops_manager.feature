Feature: Ops Manager need
  Scenario: ops_manager need with no filters and no environment
    Given a needs file with an ops_manager need
    And no ops manager environment is available
    When I check the needs
    Then the needs check fails
    
  Scenario: ops_manager need with no filters and valid environment
    Given a needs file with an ops_manager need
    And a working ops manager
    When I check the needs
    Then the needs check passes

  Scenario: ops_manager need with iaas filter and no environment
    Given a needs file with an ops_manager need with an iaas filter
    And no ops manager environment is available
    When I check the needs
    Then the needs check fails
  
  Scenario: ops_manager need with iaas filter and no environment with the wrong iaas
    Given a needs file with an ops_manager need with an iaas filter
    And a working ops manager in the wrong iaas
    When I check the needs
    Then the needs check fails
  
  Scenario: ops_manager need with iaas filter and no environment with the right iaas
    Given a needs file with an ops_manager need with an iaas filter
    And a working ops manager in the right iaas
    When I check the needs
    Then the needs check passes
