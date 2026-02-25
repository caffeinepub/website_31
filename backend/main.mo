import Nat "mo:core/Nat";
import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

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

  func assertAccessUser(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  type RiskLevel = { #normal; #moderate; #high };

  type VisitHistoryRecord = {
    visitDate : Int; // Timestamp
    weight : Float;
    hemoglobin : Float;
    bloodPressure : Nat; // Systolic BP
    notes : Text;
  };

  type VisitHistoryRecordView = {
    visitDate : Int; // Timestamp
    weight : Float;
    hemoglobin : Float;
    bloodPressure : Nat; // Systolic BP
    notes : Text;
  };

  type PregnancyRecord = {
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

  type PregnancyRecordView = {
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

  let pregnancyRecords = Map.empty<Text, PregnancyRecord>();

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
