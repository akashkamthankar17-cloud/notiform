import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Set "mo:core/Set";
import Order "mo:core/Order";
import Nat32 "mo:core/Nat32";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Persistent actor state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
};
