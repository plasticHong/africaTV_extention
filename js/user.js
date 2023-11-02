const SDK = window.AFREECA.ext;
const extensionSDK = SDK();

let isLoggedIn = false;
let isBJ = false;
let broadInfo = null; // 방송 정보
let playerInfo = null; // 플레이어 상태 정보

const init =(auth, broad, player)=>{
	isLoggedIn = !!auth.obscureUserId;
	isBJ = auth.isBJ;

	broadInfo = broad;
	playerInfo = player;

	// do something! 
}

extensionSDK.handleInitialization(init);


let div = document.getElementById("div");
div.innerHTML = "text";

const btn = document.getElementById("submit");

btn.addEventListener('click', function (){

    const text = document.getElementById("text").value;

    extensionSDK.broadcast.send('test', text);

})