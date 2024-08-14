var server_id = "d5073e6f" //change this to your server id / Thay ID của server vào đây
var ptero_token = "replace with your ptero api token"
var panel_url = "console.ataraxarealm.xyz" // change this to your panel url / Thay url của panel vào đây
var cpuCount = 2 // replace with your cpu count on panel (although it is possible to set more if you have more, just remember that most of server software except folia run on single core, so it is recommended to leave as default)
var minceraftIP = "ataraxarealm.xyz" // replace with your server IP
const axios = require('axios');
axios.defaults.withCredentials = true;
module.exports.config = {
    name: "server",
    version: "1.5.4",
    hasPermssion: 0,
    credits: "Hifumi",   // Tôn trọng người làm bằng cách không thay credit
    description: "Xem thông tin và bật server nếu nó tắt",
    commandCategory: "Tiện ích",
    usages: "stat | power",
    cooldowns: 5,
    dependencies: {
        "axios": ""
    }
}

module.exports.run = async function({ api, args, Users, event}) {
    var a = function (a) { api.sendMessage(a, event.threadID); }
switch (args[0]) {
		case "power": {
            const auth = {
                url: `/${server_id}/resources`,
                method: 'get',
                baseURL: `https://${panel_url}/api/client/servers`,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ptero_token}`
                }
            }
            axios(auth).then(res =>{
                const power = res.data.attributes.current_state
                switch (power) {
                    case 'running':
                        a("Bạn không thể bật một server đang chạy 🥶🥶🥶"); // you cant start a server which already running
                        break
                    case 'starting':
                        a("Server đang khởi động, xin hãy đợi chút lát 😅"); // server are starting, please be patient
                        break
                    case 'offline':
                        a("⚡ Đang gửi lệnh bật server..."); // Sending "start" command to server
                        const power = {
                            url: `/${server_id}/power`,
                            method: 'post',
                            baseURL: `https://${panel_url}/api/client/servers`,
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${ptero_token}`
                            },
                            data: {
                                "signal": "start"
                            }
                        }
                        axios(power)
                        a("✅ Đã gửi lệnh bật server, nếu sau 5 phút bạn vẫn chưa thấy server bật, hãy thông báo cho Admin"); // Notify that server are starting, but if it isnt then there's something wrong with the host.
                        break
                    default:
                        a("⌛ Hãy đợi vài phút rồi thử lại!"); // server could be powering off idk, my vps turn off the server so fast that i cant run command in time
                        break
                };
            })
		    break
		}
		case "stat": {
	    	const auth = {
                url: `/${server_id}/resources`,
                method: 'get',
                baseURL: `https://${panel_url}/api/client/servers`,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ptero_token}`
                }
            }
            axios(auth).then(res =>{
                const power = res.data.attributes.current_state
                    switch (power) {
                        case 'running':
                            var state = "[🟢] Status: Đang chạy" // running
                            break
                        case 'starting':
                            var state = "[🟠] Status: Đang khởi động" // starting
                            break
                        case 'offline':
                            var state = "[🔴] Status: Đã tắt" // powered off
                            break
                        default:
                            var state = "[🟠] Status: Đang tắt" // line 62 column 110
                            break
                };
                    var ram = ((res.data.attributes.resources.memory_bytes) / 1073741824).toFixed(2)
                    var cpu = ((res.data.attributes.resources.cpu_absolute) / `${cpuCount}`).toFixed(2)
                    var disk = ((res.data.attributes.resources.disk_bytes) / 1073741824).toFixed(2)
                    var upt = ((res.data.attributes.resources.uptime) / 3600000) // default is hour (value * 1000 * 60 * 60), but you can change it
                    var uptHour = (Math.floor((res.data.attributes.resources.uptime) / 3600000))
                    var min = Math.floor(upt)
                    var uptMin = (Math.floor((upt - min) * 60))
                    var sec = Math.floor((upt-min) * 60)
                    var uptSec = (Math.floor((((upt-min) * 60) - sec) * 60))
                    var down = ((res.data.attributes.resources.network_rx_bytes) / 1073741824).toFixed(2)
                    var up = ((res.data.attributes.resources.network_tx_bytes) / 1073741824).toFixed(2)
                    setTimeout(function() {axios.get('https://api.mcstatus.io/v2/status/java/ataraxarealm.xyz')}, 50) // ping the first time to get garbage data so the second time wont get error
                    const authGetResources = {
                        url: `/${server_id}`,
                        method: 'get',
                        baseURL: `https://${panel_url}/api/client/servers`,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${ptero_token}`
                        }
                    }
                    axios(authGetResources).then(res => {
                        var maxRAM = ((res.data.attributes.limits.memory) / 1024).toFixed(2)
                        var maxDisk = ((res.data.attributes.limits.disk) / 1024).toFixed(2)
                        var location = res.data.attributes.node
                        axios.get(`https://api.mcstatus.io/v2/status/java/${minceraftIP}`).then(res => {
                            switch (res.data.online) {
                                case true: {
                                    var host = res.data.host
                                    var player = res.data.players.online + "/" + res.data.players.max
                                    break
                                }
                                case false: {
                                    var host = "Server hiện không online"
                                    var player = "Server hiện không online"
                                    break
                                }
                            }
                            axios.get(`https://api.mcstatus.io/v2/status/bedrock/${minceraftIP}`).then(res => {
                                switch (res.data.online) {
                                    case true: {
                                        var mcbePort = res.data.port
                                        break
                                    }
                                    case false: {
                                        var mcbePort = "Không tồn tại"
                                    }
                                }
                                a(`[📟]━━[ Thông tin về server ]━━[📟]\n[🌐] IP: ${host}\n[🛜] Port MCBE: ${mcbePort}\n[👥] Online: ${player}\n${state}\n[💾] RAM: ${ram}/${maxRAM} GB\n[🖥️] CPU: ${cpu}%\n[🗂️] Disk: ${disk}/${maxDisk} GB\n[🔽] Downloaded: ${down} GB\n[🔼] Uploaded: ${up} GB\n[🗺️] Nơi host: ${location}\n[⏰] Uptime: ${uptHour} giờ ${uptMin} phút ${uptSec} giây`)
                            })
                        })
                    })
            })
            break
		}
		default: {
		    a("[📖]━━[ Hướng dẫn sử dụng ]━━[📖]\n• ,server power - Bật server nếu nó đang tắt\n• ,server stat - Xem thông tin về server"); // how to use the command (in vietnamese)
		    break
		}
	}
}
