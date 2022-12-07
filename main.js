const socket = io("https://audiocallgroup7githubio-production.up.railway.app/");

$("#div-chat").hide();

socket.on("DANH_SACH_ONLINE", (arrUserInfo) => {
	$("#div-chat").show();
	$("#div-dang-ky").hide();

	arrUserInfo.forEach((user) => {
		const { ten, peerId } = user;
		$("#ulUser").append(`<li id="${peerId}">${ten}</li>`);
	});

	socket.on("CO_NGUOI_DUNG_MOI", (user) => {
		const { ten, peerId } = user;
		$("#ulUser").append(`<li id="${peerId}">${ten}</li>`);
	});

	socket.on("AI_DO_NGAT_KET_NOI", (peerId) => {
		$(`#${peerId}`).remove();
	});
});

socket.on("DANG_KY_THAT_BAI", () => alert("Vui long chon username khac!"));

function openStream() {
	const config = { audio: true, video: false };
	return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idAudioTag, stream) {
	const audio = document.getElementById(idAudioTag);
	audio.srcObject = stream;
	audio.play();
}

const peer = new Peer();

peer.on("open", (id) => {
	$("#my-peer").append(id);
	$("#btnSignUp").on("click", () => {
		const username = $("#txtUsername").val();
		socket.emit("NGUOI_DUNG_DANG_KY", { ten: username, peerId: id });
	});
});

// Make Call By Clicking Online User's Name
$("#ulUser").on("click", "li", function () {
	const id = $(this).attr("id");
	const peerId = $("#my-peer").text();
	if (id === peerId) return alert("Khong the thuc hien cuoc goi cho ban than");
	openStream().then((stream) => {
		const call = peer.call(id, stream);
		call.on("stream", (remoteStream) =>
			playStream("remoteStream", remoteStream)
		);
	});
});

// Make Call By Entering ID
$("#btnCall").on("click", () => {
	const id = $("#remoteId").val();
	const peerId = $("#my-peer").text();
	if (id === peerId) return alert("Khong the thuc hien cuoc goi cho ban than");
	openStream().then((stream) => {
		const call = peer.call(id, stream);
		call.on("stream", (remoteStream) =>
			playStream("remoteStream", remoteStream)
		);
	});
});

// Answer Call
peer.on("call", (call) => {
	openStream().then((stream) => {
		call.answer(stream);
		call.on("stream", (remoteStream) =>
			playStream("remoteStream", remoteStream)
		);
	});
});
