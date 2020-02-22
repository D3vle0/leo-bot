const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const cheerio = require('cheerio');

const PREFIX = '!';
bot.on('ready', () =>{
    console.log('Logged in!');
    bot.user.setPresence({
        status: "online",
        game: {
            name: "\'리오야 도움\' 입력해!",
            type: "PLAYING"
        }
    })
});


bot.on('message', message=>{

    let args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case 'hello':
            message.reply('안녕 친구야!');
            break;
        case '웹페이지':
        case '웹사이트':
            message.channel.send('http://devleo.ga');
            break;
        case '개발자':
        case '제작자':
            message.channel.send('한국디지털미디어고등학교 웹프로그래밍과 19기 배상혁 (Devleo) :fire:');
            break;
        case '한강':
            request('http://hangang.dkserver.wo.tc', (error, response, html) => {
    
        if (!error && response.statusCode == 200) {
            var totalApi = html;
            var array = totalApi.split(",");
            var array2 = array[1].split('"');
            var array3 = array[2].split(':"');
            var array4 = array3[1].split('"}');
            var array5 = array4[0].split(' ');
            var array6 = array5[0].split('-');
            if (array6[1]<10)
                array6[1]=array6[1].substring(1,2);
            
            message.channel.send('현재 한강 수온은 ' + array2[3] + ' 도야!\n측정 시간은 '+array6[0]+'년 '+array6[1]+'월 '+array6[2]+'일 '+array5[1]);
        }
    });
            break;
        case '날씨':
        case '기온':
            request('http://api.openweathermap.org/data/2.5/forecast?id=1846918&APPID=bb682e82a8d342aca70560c4622133b0', (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    var weatherApi = html;
                    var array = weatherApi.split(',"feels');
                    var array2 = array[0].split('temp":');
                    var temperature = array2[1]-273.15;
                    var array3 = array[1].split('","description');
                    var array4 = array3[0].split('"main":"');
                    var array11 = weatherApi.split('temp_min":');
                    var array12 = array11[1].split(',"');
                    var temperature2 = array12[0]-273.15;
                    var array21 = weatherApi.split('pressure":');
                    var array22 = array21[1].split(',"');
                    var array31 = weatherApi.split('humidity":');
                    var array32 = array31[1].split(',"');
                    var array41 = weatherApi.split('wind":{"speed":');
                    var array42 = array41[1].split(',"deg":');
                    var array43 = array42[1].split('},"');

                    if (array4[1] === 'Clouds')
                        var weather = '흐려';
                    else if (array4[1] === 'Clear')
                        var weather = '화창해';
                    
                    var degree = null;
                    if (array43[0] >= 0 && array43[0] < 22.5)
                        degree = '북';
                    else if (array43[0] >= 22.5 && array43[0] < 67.5)
                        degree = '북동';
                    else if (array43[0] >= 67.5 && array43[0] < 112.5)
                        degree = '동';
                    else if (array43[0] >= 112.5 && array43[0] < 157.5)
                        degree = '남동';
                    else if (array43[0] >= 157.5 && array43[0] < 202.5)
                        degree = '남';
                    else if (array43[0] >= 202.5 && array43[0] < 247.5)
                        degree = '남서';
                    else if (array43[0] >= 247.5 && array43[0] < 292.5)
                        degree = '서';
                    else if (array43[0] >= 292.5 && array43[0] < 337.5)
                        degree = '북서';
                    else if (array43[0] >= 337.5 && array43[0] <= 360)
                        degree = '북';

                    message.channel.send('시흥시의 현재 기온은 ' + temperature.toFixed(2) + ' 도야!\n' + '날씨는 ' + weather + '!\n체감온도: ' + temperature2.toFixed(2) + '℃\n기압: ' + array22[0] + 'hPa\n습도: ' + array32[0] + '%\n풍속: ' + array42[0] + 'm/s\n풍향: ' + array43[0] + '˚ (' + degree + '향)');
                }
            });
            break;
        case '일출':
        case '일몰':
            request('https://api.sunrise-sunset.org/json?lat=37.3652195&lng=126.8148258&date=today', (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    var sun = html.split('sunrise":"');
                    var sun2 = sun[1].split(' ');
                    var sun3 = sun2[0].split(':');
                    sun3[0]-=3;
                    var print1 = '일출: ' + sun3[0] + ':' + sun3[1] + ':' + sun3[2];
                    var sun11 = html.split('sunset":"');
                    var sun22 = sun11[1].split(' ');
                    var sun33 = sun22[0].split(':');
                    sun33[0]-=3;
                    var print2 = '일몰: ' + sun33[0] + ':' + sun33[1] + ':' + sun33[2];
                    message.channel.send(print1 + '\n' + print2);
                }
            });
            break;
        case '가상화폐':
        case '비트코인':
            request('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,EOS,XRP&tsyms=KRW&api_key=ad9090f2d621b5535bc535ba9d8557c072e5e3eaaed46a080cede10dc5e98c04', (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    var bit = html.split('KRW":');
                    bit = bit[1].split('}');
                    var bit2 = html.split('ETH":{"KRW":');
                    bit2 = bit2[1].split('}');
                    var bit3 = html.split('EOS":{"KRW":');
                    bit3 = bit3[1].split('}');
                    var bit4 = html.split('XRP":{"KRW":');
                    bit4 = bit4[1].split('}');
                    message.channel.send(':money_with_wings: 현재 가상화폐 시세 :money_with_wings: \n비트코인: ' + bit[0] + '원\n이더리움: ' + bit2[0] + '원\n이오스: ' + bit3[0] + '원\n리플: ' + bit4[0] + '원\n\n(출처 - cryptocompare.com)');

                }
            });
            break;
        case '국밥':
            if (!args[1])
                message.channel.send('입력한 금액이 몇 국밥인지 계산을 하고 싶으면\n`!국밥 <금액>` 을 입력해봐!');
            else {
                var gukbap = Math.floor(args[1]/7000);
                if (isNaN(gukbap))
                    message.channel.send('우와! 어떻게 `금액`에 숫자가 아니라 문자를 입력할 수가 있지?');
                else if (gukbap == Number.POSITIVE_INFINITY)
                    message.channel.send('이렇게 큰 값을 입력할 줄이야! 대단한걸?');
                else if (gukbap == Number.NEGATIVE_INFINITY)
                    message.channel.send('```*이스터에그 발견*\n\n이스터에그 제목: 흙수저\n\n이곳에 오게 되다니 너의 창의력은 정말 대단하구나.\n보답의 의미로 내가 선물을 주겠다.\n\nhttps://drive.google.com/open?id=1MtNsca_wGv8JKqoMAnHRp6BOC5FUsWEW\n\n이곳에 접속하게 되면 낙타의 모든 실체와 사생활이 폭로 된다네!\n어서 들어가서 확인해보거라!\n```');
                else
                    message.channel.send(gukbap + '국밥이야!');
           }
        break;
        case '공지':
            if (!args[1])
                message.channel.send('사용법: `!공지 <시간>`');
            else if (args[1] >= 0 && args[1] <= 24)
                message.channel.send('오늘 서버 종료 시간은 ' + args[1] + '시입니다!');
            else
                message.channel.send('0~24 사이의 값을 입력해주세요.');
        break;
            
}


})
bot.on('guildMemberAdd', member =>{
    const channel = member.guild.channels.find(channel => channel.name === "general");

    if (!channel) return;
    channel.send(`안녕, ${member}, CodingMaster 서버에 오신 것을 환영해! 나는 어드민이 직접 개발한 봇인 리오봇 이라고 해!`);
});

bot.on('message', msg=>{
    if(msg.content === '!help' || msg.content === '리오야 도움'){
        msg.channel.send("```cs\n#리오봇 도움말\n'리오야 도움' - 간단 도움말 표시 (느낌표 없음)\n'!hello' - 당신에게 인사를 합니다.\n'!한강' - 현재 한강 수온 표시\n'!날씨' - 현재 기온과 날씨 표시\n'!웹페이지' - 개발자의 웹페이지\n'!개발자' - 개발자 정보 표시\n'!앙빌' - 앙빌과 관련된 도움말을 표시\n'!윤태' - 윤태와 관련된 도움말을 표시\n'!낙타' - 낙타에 관련된 도움말 표시\n'!희수' - 희수와 관련된 도움말 표시\n'!업데이트' - 나중에 추가할 사항 표시'```");
    }
})

bot.on('message', msg=>{
    if(msg.content === '..대치'){
        msg.channel.send('얘들아 나 대치 갔다올게\n서버는 생존 여부는 몰라!');
    }
})

bot.on('message', msg=>{
    if(msg.content === '..공부'){
        msg.channel.send('얘들아 나 공부중이야\n서버는 살아있을거야!');
    }
})

bot.on('message', msg=>{
    if(msg.content === '..밥'){
        msg.channel.send('관리자 밥먹는중...');
    }
})


bot.login(process.env.BOT_TOKEN);
