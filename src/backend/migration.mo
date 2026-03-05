import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type RiskLevel = { #normal; #moderate; #high };

  type VisitHistoryRecord = {
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

  type UserProfile = {
    name : Text;
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

  type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    pregnancyRecords : Map.Map<Text, PregnancyRecord>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    pregnancyRecords : Map.Map<Text, PregnancyRecord>;
    bmiRecords : List.List<BMIRecord>;
  };

  public func run(old : OldActor) : NewActor {
    {
      userProfiles = old.userProfiles;
      pregnancyRecords = old.pregnancyRecords;
      bmiRecords = List.empty<BMIRecord>();
    };
  };
};
