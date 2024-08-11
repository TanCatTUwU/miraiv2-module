var server_id = "d5073e6f" //change this to your server id / Thay ID của server vào đây
var ptero_token = " Put Pterodactyl API token here / Thả Pterodactyl API token vào đây"
var panel_url = "console.ataraxarealm.xyz" // change this to your panel url / Thay url của panel vào đây
const axios = require('axios');
axios.defaults.withCredentials = true;
module.exports.config = {
    name: "server",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Hifumi",   // Tôn trọng người làm bằng cách không thay credit
    description: "Xem thông tin và bật server nếu nó tắt",
    commandCategory: "Tiện ích",
    usages: "-stat | -power",
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
                    var state = "Đang chạy" // running
                    break
                case 'starting':
                    var state = "Đang khởi động" // starting
                    break
                case 'offline':
                    var state = "Đã tắt" // powered off
                    break
                default:
                    var state = "Đang tắt" // line 62 column 110
                    break
            };
            var ram = ((res.data.attributes.resources.memory_bytes) / 1073741824).toFixed(2)
            var cpu = ((res.data.attributes.resources.cpu_absolute) / 6).toFixed(2) // replace 6 with your cpu core count (mine is 600% max so its 6 thread)
            var disk = ((res.data.attributes.resources.disk_bytes) / 1073741824).toFixed(2)
            var upt = ((res.data.attributes.resources.uptime) / 3600000).toFixed(2) // default is hour, but you can change it
            var down = ((res.data.attributes.resources.network_rx_bytes) / 1073741824).toFixed(2)
            var up = ((res.data.attributes.resources.network_tx_bytes) / 1073741824).toFixed(2)
            a(`[📟]━━[ Thông tin về server ]━━[📟]\n[🌐] IP: ataraxarealm.xyz | Port MCBE: 19132\n[💾] RAM: ${ram} GB/14 GB\n[🖥️] CPU: ${cpu}%\n[🗂️] Disk: ${disk} GB/600 GB\n[🔽] Downloaded: ${down} GB\n[🔼] Uploaded: ${up} GB\n[⏰] Uptime: ${upt} giờ`); // Too lazy to make Max usage variable
            })
		    break
		}
		default: {
		    a("[📖]━━[ Hướng dẫn sử dụng ]━━[📖]\n• ,server power - Bật server nếu nó đang tắt\n• ,server stat - Xem thông tin về server");
		    break
		}
	}
}
