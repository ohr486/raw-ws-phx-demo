import {Socket} from "./phoenix"

// OK token
window.userToken = "SFMyNTY.g3QAAAACZAAEZGF0YW0AAAAHYWJjZGVmZ2QABnNpZ25lZG4GADsmVi9dAQ.TJkjH3JkoP3vUAPrw9BpYjV49iMyXe8CebqHws8HQpc"

// NG token
//window.userToken = "NGSFMyNTY.g3QAAAACZAAEZGF0YW0AAAAHYWJjZGVmZ2QABnNpZ25lZG4GADsmVi9dAQ.TJkjH3JkoP3vUAPrw9BpYjV49iMyXe8CebqHws8HQpc"

// local
let socket = new Socket("ws://localhost:4000/socket", {params: {userToken: window.userToken}})

// staging
//let socket = new Socket("ws://xxx.xxx.xxx.xxx:4000/socket", {params: {userToken: window.userToken}})

socket.connect()
socket.onOpen( ev => console.log("OPEN", ev) )
socket.onError( ev => console.log("ERROR", ev) )
socket.onClose( ev => console.log("CLOSE", ev) )
var chan = socket.channel("room:lobby", {})

// Ele
var $status = $("#status")
var $messages = $("#messages")
var $input = $("#single-message-input")
var $username = $("#username")

// JOIN
chan.join()
    .receive("ignore", () => console.log("auth error"))
    .receive("ok", () => console.log("join ok"))
    .receive("timeout", () => console.log("Connection interruption"))
chan.onError(e => console.log("something went wrong", e))
chan.onClose(e => console.log("channel closed", e))

// INPUT
$input.off("keypress").on("keypress", e => {
  if (e.keyCode == 13) {
    chan.push("new:msg", {user: $username.val(), body: $input.val()}, 10000)
    $input.val("")
  }
})

// REPLY
chan.on("new:msg", msg => {
  var body = msg.body;
  var username = msg.user;
  var amsg = `<p><a href='#'>[${username}]</a>&nbsp; ${body}</p>`;
  $messages.append(amsg);
  scrollTo(0, document.body.scrollHeight)
})
chan.on("user:entered", msg => {
  var username = $("<div/>").text(msg.user || "anonymous").html();
  $messages.append(`<br/><i>[${username} entered group-chat]</i>`)
})
