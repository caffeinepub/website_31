import Nat "mo:core/Nat";
import Text "mo:core/Text";
import List "mo:core/List";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Migration "migration";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Apply migration function on upgrade (with-clause)
(with migration = Migration.run)
actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Types
  public type UserProfile = {
    name : Text;
  };

  public type RiskLevel = { #normal; #moderate; #high };

  public type VisitHistoryRecord = {
    visitDate : Int; // Timestamp
    weight : Float;
    hemoglobin : Float;
    bloodPressure : Nat; // Systolic BP
    notes : Text;
  };

  public type VisitHistoryRecordView = {
    visitDate : Int; // Timestamp
    weight : Float;
    hemoglobin : Float;
    bloodPressure : Nat; // Systolic BP
    notes : Text;
  };

  public type PregnancyRecord = {
    name : Text;
    age : Nat;
    husbandName : Text;
    address : Text;
    phoneNumber : Text;
    lmpDate : Int; // Last Menstrual Period (timestamp)
    eddDate : Int; // Expected Delivery Date (timestamp)
    gestationalAge : Nat; // Weeks
    weight : Float;
    hemoglobinLevel : Float;
    bloodPressure : Nat; // Systolic BP
    trimester : Nat; // 1, 2, 3
    riskLevel : RiskLevel;
    visitHistory : List.List<VisitHistoryRecord>;
  };

  public type PregnancyRecordView = {
    name : Text;
    age : Nat;
    husbandName : Text;
    address : Text;
    phoneNumber : Text;
    lmpDate : Int; // Last Menstrual Period (timestamp)
    eddDate : Int; // Expected Delivery Date (timestamp)
    gestationalAge : Nat; // Weeks
    weight : Float;
    hemoglobinLevel : Float;
    bloodPressure : Nat; // Systolic BP
    trimester : Nat; // 1, 2, 3
    riskLevel : RiskLevel;
    visitHistory : [VisitHistoryRecordView];
  };

  type BMIRecord = {
    name : Text;
    age : Nat;
    gender : Text;
    heightCm : Float;
    weightKg : Float;
    bmi : Float;
    timestamp : Int;
  };

  // Storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let pregnancyRecords = Map.empty<Text, PregnancyRecord>();
  let bmiRecords = List.empty<BMIRecord>();

  // Authorization helpers
  func assertAccessUser(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  // User Profile Functionality
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    assertAccessUser(caller);
    userProfiles.add(caller, {
      name = profile.name;
    });
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    assertAccessUser(caller);
    userProfiles.get(user);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    assertAccessUser(caller);
    userProfiles.get(caller);
  };

  // Pregnancy Record Functionality
  public shared ({ caller }) func addPregnancyRecord(
    name : Text,
    age : Nat,
    husbandName : Text,
    address : Text,
    phoneNumber : Text,
    lmpDate : Int,
    eddDate : Int,
    gestationalAge : Nat,
    weight : Float,
    hemoglobinLevel : Float,
    bloodPressure : Nat,
    trimester : Nat,
    riskLevel : RiskLevel,
    initialVisit : VisitHistoryRecord,
  ) : async () {
    assertAccessUser(caller);

    let visitHistoryList = List.empty<VisitHistoryRecord>();
    visitHistoryList.add(initialVisit);

    let record = {
      name;
      age;
      husbandName;
      address;
      phoneNumber;
      lmpDate;
      eddDate;
      gestationalAge;
      weight;
      hemoglobinLevel;
      bloodPressure;
      trimester;
      riskLevel;
      visitHistory = visitHistoryList;
    };

    pregnancyRecords.add(phoneNumber, record);
  };

  func toPregnancyRecordView(record : PregnancyRecord) : PregnancyRecordView {
    let visitHistoryViewList = record.visitHistory.map<VisitHistoryRecord, VisitHistoryRecordView>(
      func(visit) {
        {
          visitDate = visit.visitDate;
          weight = visit.weight;
          hemoglobin = visit.hemoglobin;
          bloodPressure = visit.bloodPressure;
          notes = visit.notes;
        };
      }
    );

    {
      record with visitHistory = visitHistoryViewList.toArray();
    };
  };

  public query ({ caller }) func getAllPregnancyRecords() : async [PregnancyRecordView] {
    assertAccessUser(caller);

    let recordsIter = pregnancyRecords.values();
    let viewIter = recordsIter.map(toPregnancyRecordView);
    viewIter.toArray();
  };

  public query ({ caller }) func getPregnancyByPhoneNumber(phoneNumber : Text) : async ?PregnancyRecordView {
    assertAccessUser(caller);
    switch (pregnancyRecords.get(phoneNumber)) {
      case (null) { null };
      case (?record) {
        ?toPregnancyRecordView(record);
      };
    };
  };

  public query ({ caller }) func getPregnanciesByRiskLevel(riskLevel : RiskLevel) : async [PregnancyRecordView] {
    assertAccessUser(caller);

    let matchingRecords = List.empty<PregnancyRecordView>();

    for ((_, record) in pregnancyRecords.entries()) {
      if (record.riskLevel == riskLevel) {
        matchingRecords.add(toPregnancyRecordView(record));
      };
    };

    matchingRecords.toArray();
  };

  public shared ({ caller }) func addVisit(phoneNumber : Text, newVisit : VisitHistoryRecord) : async () {
    assertAccessUser(caller);
    switch (pregnancyRecords.get(phoneNumber)) {
      case (null) {
        Runtime.trap("Record not found for this phone number");
      };
      case (?existingRecord) {
        existingRecord.visitHistory.add(newVisit);
        pregnancyRecords.add(phoneNumber, existingRecord);
      };
    };
  };

  // BMI History Functionality
  public shared ({ caller }) func addBMIRecord(
    name : Text,
    age : Nat,
    gender : Text,
    heightCm : Float,
    weightKg : Float,
    bmi : Float,
    timestamp : Int,
  ) : async () {
    let bmiRecord : BMIRecord = {
      name;
      age;
      gender;
      heightCm;
      weightKg;
      bmi;
      timestamp;
    };
    bmiRecords.add(bmiRecord);
  };

  public query ({ caller }) func getAllBMIRecords() : async [BMIRecord] {
    bmiRecords.toArray();
  };

  public query ({ caller }) func getLatestBMIRecords(count : Nat) : async [BMIRecord] {
    var currentCount = 0;
    let result = List.empty<BMIRecord>();

    let iter = bmiRecords.values();
    for (record in iter) {
      if (currentCount < count) {
        result.add(record);
        currentCount += 1;
      };
    };

    result.toArray();
  };

  // Utility Functions
  public shared ({ caller }) func getNowTimestamp() : async Int {
    Time.now();
  };

  public shared ({ caller }) func getIndex(numberOfEntries : Nat) : async Int {
    if (numberOfEntries < 16) {
      0;
    } else if (numberOfEntries < 128) {
      1;
    } else if (numberOfEntries < 1024) {
      2;
    } else if (numberOfEntries < 8192) {
      3;
    } else if (numberOfEntries < 65536) {
      4;
    } else if (numberOfEntries < 524288) {
      5;
    } else if (numberOfEntries < 4194304) {
      6;
    } else if (numberOfEntries < 33554432) {
      7;
    } else {
      Runtime.trap("Number of entries is too large!");
    };
  };
};
