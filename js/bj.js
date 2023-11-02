const SDK = window.AFREECA.ext;
const extensionSDK = SDK();


let isLoggedIn = false;
let isBJ = false;
let broadInfo = null; // 방송 정보
let playerInfo = null; // 플레이어 상태 정보

const div = document.getElementById("userId");
const div2 = document.getElementById("message");
const body = document.getElementById("body");
const button = document.getElementById("someAction");

const init =(auth, broad, player)=>{
	isLoggedIn = !!auth.obscureUserId;
	isBJ = auth.isBJ;

	broadInfo = broad;
	playerInfo = player;

	// do something! 
}

const handleBroadcastReceived = (action, message, fromId, userList) => {

	if(action === 'test'){
        div.querySelector("span").innerHTML = fromId;
        div2.querySelector("span").innerHTML = message;
	}
}

extensionSDK.broadcast.listen(handleBroadcastReceived);

button.addEventListener('click', ()=>{
    extensionSDK.chat.send('MESSAGE', '감사합니다.');
})

extensionSDK.handleInitialization(init);