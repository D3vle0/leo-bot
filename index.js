const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const cheerio = require('cheerio');
const ytdl = require("ytdl-core");
const queue = new Map();


//초기 설정값
const token = '';
const prefix = '!';
const VERSION = '2020.3.15 업데이트';

bot.on('ready', () =>{
    console.log('Logged in!');
    bot.user.setPresence({
        status: "online",
        game: {
            name: "\'리오야 도움\' 입력해!",
            type: "LISTENING"
        }
    })
});


bot.on('message', message=>{

    let args = message.content.substring(prefix.length).split(" ");

    switch(args[0]){
        case '웹페이지':
        case '웹사이트':
            message.channel.send('http://devleo.us');
            break;
        case '개발자':
        case '제작자':
            if(!args[1])
                message.channel.send('1423 배상혁 (Devleo) :fire:\n개발자를 호출하려면 `!개발자 호출` 을 입력해봐!\n개발자에게 dm 하려면 `!개발자 dm` 을 입력해봐!');
            if (args[1] == '호출')
                message.channel.send(`<@!671631736404180992>\n ${message.author} 님이 호출했습니다!`);
            else if (args[1] == 'dm')
                message.author.send("봇에 문제가 있나요? @D3vle0#1846 에게 dm 주세요!");
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
            if (array6[1] < 10) array6[1] = array6[1].substring(1, 2);
            
            message.channel.send('현재 한강 수온은 ' + array2[3] + ' 도야!\n측정 시간은 '+array6[0]+'년 '+array6[1]+'월 '+array6[2]+'일 '+array5[1]);
        }
    });
            break;
        case '날씨':
        case '기온':
            /*
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

                    message.channel.send('시흥시의 현재 기온은 ' + temperature.toFixed(2) + ' 도야!\n' + '날씨는 ' + weather + '!\n체감온도: ' + temperature2.toFixed(2) + '℃\n기압: ' + array22[0] + 'hPa\n습도: ' + array32[0] + '%\n풍속: ' + array42[0] + 'm/s\n풍향: ' + array43[0] + '˚ (' + degree + '풍)');
                }
            });
            */
           if (!args[1])
           message.channel.send('지역을 입력해!\n사용법: `!날씨 <지역> [날짜]`, 날짜 = [오늘, 내일, 모레]');
       else if (!args[2] || args[2] == '오늘'){
           var weatherurl = 'https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query='.concat(args[1], "+날씨");
           var realurl = (encodeURI(weatherurl));
           request(realurl, (error, response, html) => {
               if (!error && response.statusCode == 200) {
                   const $ = cheerio.load(html);
                   message.channel.send(args[1] + ' 날씨: ' + $(".todaytemp")[0].children[0].data + '℃\n' + $(".cast_txt")[0].children[0].data + '\n최저: ' + $(".num")[0].children[0].data + ', 최고: ' + $(".num")[1].children[0].data + '\n체감: ' + $(".num")[2].children[0].data);
               }
           });
       }
       else if (args[2] == '내일'){
           var weatherurl = 'https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query='.concat(args[1], "+날씨");
           var realurl = (encodeURI(weatherurl));
           request(realurl, (error, response, html) => {
               if (!error && response.statusCode == 200) {
                   const $ = cheerio.load(html);
                   message.channel.send('내일 ' + args[1] + ' 날씨\n오전: ' + $(".todaytemp")[1].children[0].data + '℃, ' + $(".cast_txt")[1].children[0].data + '\n오후: ' + $(".todaytemp")[2].children[0].data + '℃, ' + $(".cast_txt")[2].children[0].data);
               }
           });
       }
       else if (args[2] == '모레'){
           var weatherurl = 'https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query='.concat(args[1], "+날씨");
           var realurl = (encodeURI(weatherurl));
           request(realurl, (error, response, html) => {
               if (!error && response.statusCode == 200) {
                   const $ = cheerio.load(html);
                   message.channel.send('모레 ' + args[1] + ' 날씨\n오전: ' + $(".todaytemp")[3].children[0].data + '℃, ' + $(".cast_txt")[3].children[0].data + '\n오후: ' + $(".todaytemp")[4].children[0].data + '℃, ' + $(".cast_txt")[4].children[0].data);
               }
           });
       }
       else if (!args[2] || args[2] != '오늘' && args[2] != '내일' && args[2] != '모레')
           message.channel.send('날짜는 `오늘, 내일, 모레` 를 입력할 수 있어!');
   break;
   case '미세먼지':
       if (!args[1])
           message.channel.send('지역을 입력해! `!미세먼지 <지역>`');
       else {
           var weatherurl = 'https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query='.concat(args[1], "+날씨");
           var realurl = (encodeURI(weatherurl));
           request(realurl, (error, response, html) => {
               if (!error && response.statusCode == 200) {
                   const $ = cheerio.load(html);
                   var chomise = $(".num")[5].children[0].data;
                   var mise = $(".num")[4].children[0].data.split('㎍/㎥');
                   var chomise = $(".num")[5].children[0].data.split('㎍/㎥');
                   if (chomise[0] == 'null'){
                       chomise = '데이터 없음';
                       var status2 = '';
                   }
                       
                   if (mise[0] <= 30)
                       var status1 = '좋음';
                   else if (mise[0] > 30 &&  mise[0] <= 80)
                       var status1 = '보통';
                   else if (mise[0] > 80 && mise[0] <= 150)
                       var status1 = '나쁨';
                   else if (mise[0] > 150)
                       var status2 = '매우 나쁨';
                   if (chomise[0] <= 30)
                       var status2 = '좋음';
                   else if (chomise[0] > 30 &&  mise[0] <= 80)
                       var status2 = '보통';
                   else if (chomise[0] > 80 && mise[0] <= 150)
                       var status2 = '나쁨';
                   else if (chomise[0] > 150)
                       var status2 = '매우 나쁨';
                   message.channel.send('미세먼지: ' + mise[0] + ', ' + status1 + '\n초미세먼지: ' + chomise + ' ' + status2 + '\n오존지수: ' + $(".num")[6].children[0].data);
               }
           });
       }
            break;
        case '일출':
            if (!args[1])
                message.channel.send('실존하는 지역을 입력해! `!일출 <지역>`');
            else {
                if (!args[2]){
                    var location = args[1];
                    var url = 'https://sunrise-sunset.org/search?location=' + encodeURI(args[1]);
                }
                else if (!args[3]){
                    var location = args[1] + ' ' + args[2];
                    var url = 'https://sunrise-sunset.org/search?location=' + encodeURI(args[1] + ' ' + args[2]);
                }
                else if (!args[4]){
                    var location = args[1] + ' ' + args[2] + ' ' + args[3];
                    var url = 'https://sunrise-sunset.org/search?location=' + encodeURI(args[1] + ' ' + args[2] + ' ' + args[3]);
                }
                else if (!args[5]){
                    var location = args[1] + ' ' + args[2] + ' ' + args[3] + ' ' + args[4];
                    var url = 'https://sunrise-sunset.org/search?location=' + encodeURI(args[1] + ' ' + args[2] + ' ' + args[3] + ' ' + args[4]);
                }
                request(url, (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(html);
                    var sunrise1 = $(".time")[0].children[0].data;
                    var sunrise2 = $(".time")[2].children[0].data;
                    message.channel.send(location + ' 일출시간\n오늘: ' + sunrise1 + '\n내일: ' + sunrise2);
                }
                });
            }
            break;

        case '일몰':
            if (!args[1])
                message.channel.send('실존하는 지역을 입력해! `!일몰 <지역>`');
            else {
                if (!args[2]){
                    var location = args[1];
                    var url = 'https://sunrise-sunset.org/search?location=' + encodeURI(args[1]);
                }
                else if (!args[3]){
                    var location = args[1] + ' ' + args[2];
                    var url = 'https://sunrise-sunset.org/search?location=' + encodeURI(args[1] + ' ' + args[2]);
                }
                else if (!args[4]){
                    var location = args[1] + ' ' + args[2] + ' ' + args[3];
                    var url = 'https://sunrise-sunset.org/search?location=' + encodeURI(args[1] + ' ' + args[2] + ' ' + args[3]);
                }
                else if (!args[5]){
                    var location = args[1] + ' ' + args[2] + ' ' + args[3] + ' ' + args[4];
                    var url = 'https://sunrise-sunset.org/search?location=' + encodeURI(args[1] + ' ' + args[2] + ' ' + args[3] + ' ' + args[4]);
                }
                request(url, (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(html);
                    var sunset1 = $(".time")[1].children[0].data;
                    var sunset2 = $(".time")[3].children[0].data;
                    message.channel.send(location + ' 일몰시간\n오늘: ' + sunset1 + '\n내일: ' + sunset2);
                }
                });
            }
            break;
        case '가상화폐':
        case '비트코인':
            request('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,EOS,XRP&tsyms=KRW&api_key=ad9090f2d621b5535bc535ba9d8557c072e5e3eaaed46a080cede10dc5e98c04', (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    var bit = html.split('KRW":');
                    bit = bit[1].split('}');
                    //console.log(bit[0]);
                    var bit2 = html.split('ETH":{"KRW":');
                    bit2 = bit2[1].split('}');
                    //console.log(bit2[0]);
                    var bit3 = html.split('EOS":{"KRW":');
                    bit3 = bit3[1].split('}');
                    //console.log(bit3[0]);
                    var bit4 = html.split('XRP":{"KRW":');
                    bit4 = bit4[1].split('}');
                    //console.log(bit4[0]);
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
                    message.channel.send('```*이스터에그 발견*\n\n이스터에그 제목: 흙수저\n\n이곳에 오게 되다니 너의 창의력은 정말 대단하구나.```');
                else
                    message.channel.send(gukbap + '국밥이야!');
            }
            break;
        /*
        case '공지':
                if (!args[1])
                    message.channel.send('사용법: `!공지 <시간>`');
                else if (args[1] >= 0 && args[1] <= 24)
                    message.channel.send('오늘 서버 종료 시간은 ' + Math.floor(args[1]) + '시입니다!');
                else
                    message.channel.send('0~24 사이의 값을 입력해주세요.');
            break;
        */
        case '버전':
            message.channel.send(VERSION);
            break;
        case '전적':
            if (!args[1])
                message.channel.send('`!전적 <닉네임>` 입력해!');
            else {
                message.channel.send('https://www.op.gg/summoner/userName=' + args[1]);
                //var lolKill = [], lolDeath = [], lolAssist = [];
                var url = 'https://www.op.gg/summoner/userName=' + (encodeURI(args[1]));
                
                request(url, (error, response, html) => {
                    if (!error && response.statusCode == 200) {
                        const $ = cheerio.load(html);
                        /*
                        var exception = [];
                        for (var i=3;i<8;i++){
                            var tt = Number($(".Kill")[i].children[0].data);
                            if (Number.isInteger(tt))
                                lolKill[i-3] = $(".Kill")[i].children[0].data;
                            else {
                                exception.push(i);

                            }
                        }
                        
                        console.log(lolKill.filter(function () { return true }));
                        for (var i=3;i<8;i++){
                            var tt = Number($(".Death")[i].children[0].data);
                            if (Number.isInteger(tt))
                                lolDeath[i-3] = $(".Death")[i].children[0].data;
                        }
                        console.log(lolDeath.filter(function () { return true }));
                        */
                        var win = $(".win")[0].children[0].data;
                        var lose = $(".lose")[0].children[0].data;
                        message.channel.send('랭크 타입: ' + $(".RankType")[0].children[0].data + '\n랭크: ' + $(".TierRank")[0].children[0].data.trim() + '\n최근 20경기: ' + win + '승 ' + lose + '패 (승률 ' + Math.floor(win/20*100) + '%)');
                       //console.log($(".KDAratio")[1].children[0].data);
                    }
                });
            }
            break;
        case '코로나':
        case '코로나바이러스':
        case '확진자':
        case '감염자':
        case '바이러스':
            request('https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=%EC%BD%94%EB%A1%9C%EB%82%98', (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                var no_comma = parseInt($(".num")[0].children[0].data.replace(/,/g,""));
                var death = $(".num")[3].children[0].data;
                
                message.channel.send('국내 확진자: ' + $(".num")[0].children[0].data + '명\n격리해제: ' + $(".num")[1].children[0].data + '명\n검사 진행중: ' + $(".num")[2].children[0].data + '명\n사망자: ' + $(".num")[3].children[0].data + '명\n\n국내 치사율: ' + death/no_comma*100 + '%\n\n이곳에서 확진자 예측 확인 가능합니다! http://corona.devleo.us');
            }
            });
            break;           
        case '카트':
            if(!args[1])
                message.channel.send('카트 전적을 검색할 닉네임을 입력해! `!카트 <닉네임> [대전 형태 (개인전, 팀전)]`\n카트 대결 시뮬레이션을 하고 싶다면 `!카트 대결 <닉네임>` 을 입력해!');
            else {
                if (args[1] != '대결'){
                    if(!args[2])
                        message.channel.send('https://tmi.nexon.com/kart/user?nick=' + args[1]);
                    else if (args[2] == '개인' || args[2] == '개인전')
                        message.channel.send('https://tmi.nexon.com/kart/user?nick=' + args[1] + '&matchType=indi');
                    else if (args[2] == '팀' || args[2] == '팀전')
                        message.channel.send('https://tmi.nexon.com/kart/user?nick=' + args[1] + '&matchType=team');
                    else
                        message.channel.send('잘못 입력했어!');
                }
                else {
                    if (args[2])
                        message.channel.send('https://tmi.nexon.com/simulator/' + args[2]);
                    else
                        message.channel.send('닉네임을 입력해!');
                }
                   
            }
        break;
        /*
        case '탄핵':
        case '문재인':
        case '문재인탄핵':
        case '문재앙':
            request('https://www1.president.go.kr/petitions/584936', (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                var tanhaek = $(".counter")[0].children[0].data;
                message.channel.send('문재인 탄핵 동의: ' + tanhaek + '명');
            }
            });
            break;
        
        case 'ip':
        case 'IP':
        case '아이피':
        case '위치':
        case '신상':
            request(
                "https://api.myip.com/",
                (error, response, html) => {
                  if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(html);
                    const obj = JSON.parse(html);
                    console.log(obj.ip, obj.country, obj.cc);
                    message.channel.send('나의 IP: ' + obj.ip + '\n접속 국가: ' + obj.country + '\n국가 코드: ' + obj.cc);
                  }
                }
            );
        break;
        */
        case '마스크':
            if (!args[1])
                message.channel.send('검색할 주소를 입력해! `!마스크 <도> <시/군/구> [동]`');
            else {
                if (!args[2])
                    message.channel.send('세부 주소를 입력해줘 (시,군,구)');
                else {
                    if (!args[3]){
                        /*
                        var url = (encodeURI('https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=' + args[1] + ' ' + args[2]));
                        console.log(url);
                        request(
                            url,
                            (error, response, html) => {
                                if (!error && response.statusCode == 200) {
                                //const $ = cheerio.load(html);
                                const obj = JSON.parse(html);
                                for (var i=0;i<obj.count;i++){
                                    if (obj.stores[i].remain_stat == 'null')
                                        var remain = '데이터 없음';
                                    else if (obj.stores[i].remain_stat == 'empty')
                                        var remain = '품절';
                                    else if (obj.stores[i].remain_stat == 'few')
                                        var remain = '2~29개';
                                    else if (obj.stores[i].remain_stat == 'some')
                                        var remain = '30~99개';
                                    else if (obj.stores[i].remain_stat == 'plenty')
                                        var remain = '100개 이상';
                                    var stockDate = obj.stores[i].stock_at;
                                    var tmp1 = stockDate.split('/');
                                    var tmp2 = tmp1[2].split(':');
                                    var tmp3 = tmp2[0].split(' ');
                                    //console.log(tmp1[1] +','+tmp3[0]+','+tmp3[1]+','+tmp2[1]);
                                    var printStr = obj.stores[i].name + ' - ' + remain + ' (재입고 ' + tmp1[1] + '월'+ tmp3[0] + '일 ' + tmp3[1] + '시 ' + tmp2[1] + '분)';
                                    message.channel.send(printStr);
                                }
                                
                              }
                            }
                        );
                        */
                       
                        message.channel.send('봇 내부 오류로 인해 주소를 조금만 더 세분화 해주겠니? 조만간 수정할게!');
                    }
                    else {
                        var url = (encodeURI('https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=' + args[1] + ' ' + args[2] + ' ' + args[3]));
                        console.log(url);
                        request(
                            url,
                            (error, response, html) => {
                                if (!error && response.statusCode == 200) {
                                //const $ = cheerio.load(html);
                                const obj = JSON.parse(html);
                                for (var i=0;i<obj.count;i++){
                                    if (obj.stores[i].remain_stat == 'null')
                                        var remain = '데이터 없음';
                                    else if (obj.stores[i].remain_stat == 'empty')
                                        var remain = '품절';
                                    else if (obj.stores[i].remain_stat == 'few')
                                        var remain = '2~29개';
                                    else if (obj.stores[i].remain_stat == 'some')
                                        var remain = '30~99개';
                                    else if (obj.stores[i].remain_stat == 'plenty')
                                    var remain = '100개 이상';
                                    var stockDate = obj.stores[i].stock_at;
                                    var tmp1 = stockDate.split('/');
                                    var tmp2 = tmp1[2].split(':');
                                    var tmp3 = tmp2[0].split(' ');
                                    //console.log(tmp1[1] +','+tmp3[0]+','+tmp3[1]+','+tmp2[1]);
                                    var printStr = obj.stores[i].name + ' - ' + remain + ' (재입고 ' + tmp1[1] + '월'+ tmp3[0] + '일 ' + tmp3[1] + '시 ' + tmp2[1] + '분)';
                                    message.channel.send(printStr);
                                }
                                
                              }
                            }
                        );
                    }
                }
                    
            }
        case '디미고':
        case '디미':
            message.channel.send('개발중인 기능입니다!');
            /*
            request('https://www.dimigo.hs.kr', (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                const tmp = $('.list-posts').text();
                message.channel.send(tmp);
            }
            });
            */
           break;
            
        
    }
})
/*
bot.on('guildMemberAdd', member =>{
    const channel = member.guild.channels.find(channel => channel.name === "general");

    if (!channel) return;
    channel.send(`안녕, ${member}, CodingMaster 서버에 오신 것을 환영해! 나는 어드민이 직접 개발한 봇인 리오봇 이라고 해!`);8
});
*/
bot.on('message', msg=>{
    if(msg.content === '!help' || msg.content === '리오야 도움'){
        msg.channel.send("```cs\n#리오봇 도움말\n\n#기본 도움말\n'리오야 도움' - 도움말 표시\n'안녕' - 당신에게 인사를 합니다.\n'!웹페이지' - 개발자의 웹페이지\n'!개발자' - 개발자 정보 표시\n'!버전' - 현재 버전 표시\n\n#유틸리티\n'!한강' - 현재 한강 수온 표시\n'!날씨' - 지역별 기온과 날씨 표시\n'!미세먼지' - 지역별 미세먼지 표시\n'!국밥' - 입력한 금액이 몇 국밥인지 계산\n'!비트코인, !가상화폐' - 대표 가상화폐 4종 현재 시세 표시\n'!일출, !일몰' - 지역별 일출, 일몰 시간 표시\n'!코로나' - 현재 국내 코로나19 확진자 정보, 예측 시스템 표시\n'!전적' - 롤 전적 검색\n'!카트' - 카트 전적 검색\n'!마스크' - 지역별 약국의 마스크 물량 검색```");
    }
})

bot.on('message', msg=>{
    if(msg.content === '안녕' || msg.content === 'ㅎㅇ' || msg.content === 'gd' || msg.content === 'ㅎㅇㅎㅇ' || msg.content === 'gdgd' || msg.content === 'GD' || msg.content === 'GDGD'){
        msg.channel.send(`${msg.author} 안녕 친구!`);
    }
})

const bet = '리오야 도박';

bot.on('message', msg=>{
    if(msg.content.indexOf(bet) != -1){
        let betArgs = msg.content.split(" ");
        if (betArgs[2] == '돈')
            msg.channel.send('!돈');
        else if (betArgs[2] == '베팅' && betArgs[3])
            msg.channel.send('!도박 ' + betArgs[3]);
        else if (betArgs[2] == '올인')
            msg.channel.send('!올인');
    }
})

bot.login(token);
