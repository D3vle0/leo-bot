const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

let data = JSON.parse(fs.readFileSync('credentials.json'));
console.log("bot token = " + data.token)

//초기 설정값
const token = data.token;
const github_token = data.github_api;
const prefix = '!';
const VERSION = `2020.10.4 업데이트

업데이트 사항
1. 메세지 출력을 embed 형식으로 변경 (진행 중)
2. codeup.kr 전적 기능
3. github api 이용한 github 유저 정보 크롤링`

var uptime_sec = 0
var uptime_min = 0
var uptime_hour = 0
var uptime_day = 0

var mealbot_on_status = 0;

bot.on('ready', () => {
    console.log('Logged in!');
    bot.user.setPresence({
        status: "online",
        game: {
            name: "\'리오야 도움\' 입력해!",
            type: "LISTENING"
        }
    })
    var x = setInterval(function () {
        uptime_sec++;
        if (uptime_sec >= 60) {
            uptime_min++;
            uptime_sec = 0;
        }
        if (uptime_min >= 60) {
            uptime_hour++;
            uptime_min = 0;
        }
        if (uptime_hour >= 24) {
            uptime_day++;
            uptime_hour = 0;
        }
    }, 1 * 1000);
});

bot.on('message', message => {
    function weather(date, num1, num2) {
        var weatherurl = 'https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query='.concat(args[1], "+날씨");
        request(encodeURI(weatherurl), (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                try { var tom_morning = $(".todaytemp")[num1].children[0].data; } catch (e) {
                  let embed = new Discord.MessageEmbed()
                  .setColor('#de0b43')
                  .setTitle('날씨')
                  .setDescription('')
                  .addField(':exclamation:  에러 발생', '에러 코드 0x01: 실존하는 지역이 아님', true)
                  message.channel.send(embed)
                }
                try { } catch (e) { }
                try { var weather_morning = $(".cast_txt")[num1].children[0].data; } catch (e) { }
                try { var tom_after = $(".todaytemp")[num2].children[0].data; } catch (e) { }
                try { var weather_after = $(".cast_txt")[num2].children[0].data } catch (e) { } finally {
                    if (tom_morning !== undefined || tom_after !== undefined){
                      let embed = new Discord.MessageEmbed()
                      .setColor('#4fe8a3')
                      .setTitle(args[1] + " " + args[2] + ' 날씨')
                      .setDescription('')
                      if (tom_morning > tom_after){
                        embed.addField('낮 :high_brightness:  ', weather_morning + " " + tom_morning, true)
                        embed.addField('밤 :crescent_moon:  ', weather_after + " " + tom_after, true)
                      }
                      else{
                        embed.addField('오전 :high_brightness:  ', weather_morning + " " + tom_morning, true)
                        embed.addField('오후 :crescent_moon:  ', weather_after + " " + tom_after, true)
                      }
                      message.channel.send(embed)
                    }
                }
            }
        });
    }
    let args = message.content.substring(prefix.length).split(" ");
    switch (args[0]) {
        case '웹페이지':
        case '웹사이트':
            message.channel.send(new Discord.MessageEmbed()
            .setColor('#4fe8a3')
            .setTitle('개발자의 웹사이트')
            .setDescription('')
            .addField('http://devleo.us', '많이 방문해주세요' ,false)
          )
            break;
        case '개발자':
        case '제작자':
            if (!args[1]){
              message.channel.send(new Discord.MessageEmbed()
              .setColor('#4fe8a3')
              .setTitle('개발자')
              .setDescription('`!개발자 호출` 로 나를 부를 수 있어! 물론 같은서버에 있어야지 ..')
              .addField('개발자', 'KDMHS 19WP 배상혁\n@D3vle0#1846' ,false)
            )
          }
            if (args[1] == '호출'){
              message.channel.send(new Discord.MessageEmbed()
              .setColor('#4fe8a3')
              .setTitle('개발자 호출')
              .setDescription('<@!671631736404180992>')
              .addField('누군가가 불렀어요!', `${message.author} 님의 메세지를 확인하세요!` ,false)
            )
            }
            break;
        case '한강':
            request('http://hangang.dkserver.wo.tc', (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    const river = JSON.parse(html);
                    let embed = new Discord.MessageEmbed()
                    .setColor('#4fe8a3')
                    .setTitle('한강 수온')
                    .setDescription('')
                    .addField(':droplet: ' + river.temp, '측정 시각: ' + river.time, true)
                    message.channel.send(embed)
                }
            });
            break;
        case '날씨':
        case '기온':
            if (!args[1])
                message.channel.send('지역을 입력해!\n사용법: `!날씨 <지역> [날짜]`, 날짜 = [오늘, 내일, 모레]');
            else if (!args[2] || args[2] == '오늘') {
                var pattern_spc = /[`~!@#$%^&*()_+|<>?:;.,-=/{}]/;
                if (!(pattern_spc.test(args[1]))) {
                    var weatherurl = 'https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query='.concat(args[1], "+날씨");
                    request(encodeURI(weatherurl), (error, response, html) => {
                        if (!error && response.statusCode == 200) {
                            const $ = cheerio.load(html);
                            try { var temperature = $(".todaytemp")[0].children[0].data; } catch (e) {
                              let embed = new Discord.MessageEmbed()
                              .setColor('#de0b43')
                              .setTitle('날씨')
                              .setDescription('')
                              .addField(':exclamation:  에러 발생', '에러 코드 0x01: 실존하는 지역이 아님', true)
                              message.channel.send(embed)
                            }
                            try { var weather = $(".cast_txt")[0].children[0].data; } catch (e) { }
                            try { var temp_min = $(".num")[0].children[0].data; } catch (e) { }
                            try { var temp_high = $(".num")[1].children[0].data; } catch (e) { }
                            try { var temp_body = $(".num")[2].children[0].data; } catch (e) { } finally {
                                if (temperature !== undefined || weather !== undefined){
                                  let embed = new Discord.MessageEmbed()
                                  .setColor('#4fe8a3')
                                  .setTitle(args[1]+' 날씨')
                                  .setDescription('')
                                  temp_high = Number(temp_high);
                                  temp_min = Number(temp_min);
                                  if (Number.isInteger(temp_high) && Number.isInteger(temp_min)){
                                    if (weather.indexOf('맑') != -1)
                                      embed.addField('기온', ':sunny:  ' + temperature + '\n:arrow_up_small:  ' + temp_high + '\n:arrow_down_small:  ' + temp_min, false)
                                    else if (weather.indexOf('흐') != -1)
                                      embed.addField('기온', ':cloud:  ' + temperature + '\n:arrow_up_small:  ' + temp_high + '\n:arrow_down_small:  ' + temp_min, false)
                                    else if (weather.indexOf('비') != -1)
                                      embed.addField('기온', ':cloud_rain:  ' + temperature + '\n:arrow_up_small:  ' + temp_high + '\n:arrow_down_small:  ' + temp_min, false)
                                    else if (weather.indexOf('대체로 화창') != -1)
                                      embed.addField('기온', ':partly_sunny:  ' + temperature + '\n:arrow_up_small:  ' + temp_high + '\n:arrow_down_small:  ' + temp_min, false)
                                    else
                                      embed.addField('기온', temperature + '\n:arrow_up_small:  ' + temp_high + '\n:arrow_down_small:  ' + temp_min, false)
                                  }
                                  else {
                                    if (weather.indexOf('맑') != -1)
                                      embed.addField('기온', ':sunny:  ' + temperature, false)
                                    else if (weather.indexOf('흐') != -1)
                                      embed.addField('기온', ':cloud: ' + temperature, false)
                                    else if (weather.indexOf('비') != -1)
                                      embed.addField('기온', ':cloud_rain:  ' + temperature, false)
                                    else if (weather.indexOf('대체로 화창') != -1)
                                      embed.addField('기온', ':partly_sunny:  ' + temperature, false)
                                    else
                                      embed.addField('기온', temperature, false)
                                  }
                                  message.channel.send(embed)
                                }
                            }
                        }
                    });
                }
                else{
                  let embed = new Discord.MessageEmbed()
                  .setColor('#de0b43')
                  .setTitle('날씨')
                  .setDescription('')
                  .addField(':exclamation:  에러 발생', '에러 코드 0x02: 특수문자 입력 에러', true)
                  message.channel.send(embed)
                }
            }
            else if (args[2] == '내일')
                weather(args[2], 1, 2);
            else if (args[2] == '모레')
                weather(args[2], 3, 4);
            else if (!args[2] || args[2] != '오늘' && args[2] != '내일' && args[2] != '모레')
                message.channel.send('날짜는 `오늘, 내일, 모레` 를 입력할 수 있어!');
            break;
        case '미세먼지':
            if (!args[1])
                message.channel.send('지역을 입력해! `!미세먼지 <지역>`');
            else {
                if (!args[2])
                  var weatherurl = 'https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query='.concat(args[1], "+날씨");
                else if (!args[3])
                  var weatherurl = 'https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=' + args[1] + ' ' + args[2] + ' ' + '+날씨';
                  else if (!args[4])
                    var weatherurl = 'https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=' + args[1] + ' ' + args[2] + ' ' + args[3] + ' ' + '+날씨';
                var realurl = (encodeURI(weatherurl));
                request(realurl, (error, response, html) => {
                    if (!error && response.statusCode == 200) {
                        const $ = cheerio.load(html);
                        var chomise = $(".num")[5].children[0].data;
                        var mise = $(".num")[4].children[0].data.split('㎍/㎥');
                        var chomise = $(".num")[5].children[0].data.split('㎍/㎥');
                        if (chomise[0] == 'null') {
                            chomise = '데이터 없음';
                            var status2 = '';
                        }
                        if (mise[0] <= 30)
                            var status1 = '좋음';
                        else if (mise[0] > 30 && mise[0] <= 80)
                            var status1 = '보통';
                        else if (mise[0] > 80 && mise[0] <= 150)
                            var status1 = '나쁨';
                        else if (mise[0] > 150)
                            var status2 = '매우 나쁨';
                        if (chomise[0] <= 30)
                            var status2 = '좋음';
                        else if (chomise[0] > 30 && mise[0] <= 80)
                            var status2 = '보통';
                        else if (chomise[0] > 80 && mise[0] <= 150)
                            var status2 = '나쁨';
                        else if (chomise[0] > 150)
                            var status2 = '매우 나쁨';
                        let embed = new Discord.MessageEmbed()
                          .setColor('#4fe8a3')
                          .setTitle('미세먼지')
                          .setDescription('')
                          .addField('미세먼지 ', mise[0] + ' ' + status1, true)
                          .addField('초미세먼지 ', chomise + ' ' + status2, true)
                          .addField('오존지수 ', $(".num")[6].children[0].data, true)
                        message.channel.send(embed)
                      }
                });
            }
            break;
        case '일출':
            if (!args[1])
                message.channel.send('실존하는 지역을 입력해! `!일출 <지역>`');
            else {
                if (!args[2]) {
                    var location = args[1];
                    var url = 'https://sunrise-sunset.org/search?location=' + encodeURI(args[1]);
                }
                else if (!args[3]) {
                    var location = args[1] + ' ' + args[2];
                    var url = 'https://sunrise-sunset.org/search?location=' + encodeURI(args[1] + ' ' + args[2]);
                }
                else if (!args[4]) {
                    var location = args[1] + ' ' + args[2] + ' ' + args[3];
                    var url = 'https://sunrise-sunset.org/search?location=' + encodeURI(args[1] + ' ' + args[2] + ' ' + args[3]);
                }
                else if (!args[5]) {
                    var location = args[1] + ' ' + args[2] + ' ' + args[3] + ' ' + args[4];
                    var url = 'https://sunrise-sunset.org/search?location=' + encodeURI(args[1] + ' ' + args[2] + ' ' + args[3] + ' ' + args[4]);
                }
                request(url, (error, response, html) => {
                    if (!error && response.statusCode == 200) {
                        const $ = cheerio.load(html);
                        try {
                            var sunrise1 = $(".time")[0].children[0].data;
                        } catch (e) {
                          let embed = new Discord.MessageEmbed()
                          .setColor('#de0b43')
                          .setTitle('일출 :high_brightness:')
                          .setDescription('')
                          .addField(':exclamation:  에러 발생', '에러 코드 0x01: 실존하는 지역을 입력해줘!', true)
                          message.channel.send(embed)
                        }
                        try {
                            var sunrise2 = $(".time")[2].children[0].data;
                        } catch (e) { } finally {
                            if (sunrise1 !== undefined && sunrise2 !== undefined){
                              let embed = new Discord.MessageEmbed()
                                .setColor('#4fe8a3')
                                .setTitle(location + ' 일출 :high_brightness:')
                                .setDescription('')
                                .addField('오늘: ', sunrise1, true)
                                .addField('내일: ', sunrise2, true)
                              message.channel.send(embed)
                            }
                        }
                    }
                });
            }
            break;

        case '일몰':
            if (!args[1])
                message.channel.send('실존하는 지역을 입력해! `!일몰 <지역>`');
            else {
                if (!args[2]) {
                    var location = args[1];
                    var url = 'https://sunrise-sunset.org/search?location=' + encodeURI(args[1]);
                } else if (!args[3]) {
                    var location = args[1] + ' ' + args[2];
                    var url = 'https://sunrise-sunset.org/search?location=' + encodeURI(args[1] + ' ' + args[2]);
                } else if (!args[4]) {
                    var location = args[1] + ' ' + args[2] + ' ' + args[3];
                    var url = 'https://sunrise-sunset.org/search?location=' + encodeURI(args[1] + ' ' + args[2] + ' ' + args[3]);
                } else if (!args[5]) {
                    var location = args[1] + ' ' + args[2] + ' ' + args[3] + ' ' + args[4];
                    var url = 'https://sunrise-sunset.org/search?location=' + encodeURI(args[1] + ' ' + args[2] + ' ' + args[3] + ' ' + args[4]);
                }
                request(url, (error, response, html) => {
                    if (!error && response.statusCode == 200) {
                        const $ = cheerio.load(html);
                        try {
                            var sunset1 = $(".time")[1].children[0].data;
                        } catch (e) {
                          let embed = new Discord.MessageEmbed()
                          .setColor('#de0b43')
                          .setTitle('일출 :high_brightness:')
                          .setDescription('')
                          .addField(':exclamation:  에러 발생', '에러 코드 0x01: 실존하는 지역을 입력해줘!', true)
                          message.channel.send(embed)
                        }
                        try {
                            var sunset2 = $(".time")[3].children[0].data;
                        } catch (e) { } finally {
                            if (sunset1 !== undefined && sunset2 !== undefined){
                              let embed = new Discord.MessageEmbed()
                                .setColor('#4fe8a3')
                                .setTitle(location + ' 일몰 :high_brightness:')
                                .setDescription('')
                                .addField('오늘: ', sunset1, true)
                                .addField('내일: ', sunset2, true)
                              message.channel.send(embed)
                            }

                        }
                    }
                });
            }
            break;
        case '가상화폐':
        case '비트코인':
            request('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,EOS,XRP&tsyms=KRW&api_key=ad9090f2d621b5535bc535ba9d8557c072e5e3eaaed46a080cede10dc5e98c04', (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    const bit = JSON.parse(html);
                    let embed = new Discord.MessageEmbed()
                      .setColor('#4fe8a3')
                      .setTitle('가상화폐 시세 :money_with_wings:')
                      .setDescription('')
                      .addField('BTC: ', bit.BTC.KRW, true)
                      .addField('ETH: ', bit.ETH.KRW, true)
                      .addField('EOS: ', bit.EOS.KRW, true)
                      .addField('XRP: ', bit.XRP.KRW, true)
                    message.channel.send(embed)
                }
            });
            break;
        case '국밥':
            if (!args[1]){
              let embed = new Discord.MessageEmbed()
                .setColor('#4fe8a3')
                .setTitle('국밥 계산기')
                .setDescription('1국밥 == 7000원')
                .addField('\0', '입력한 금액이 몇 국밥인지 계산을 하고 싶으면\n`!국밥 <금액>` 을 입력해봐!', true)
              message.channel.send(embed)
            }
            else {
                var gukbap = Math.floor(args[1] / 7000);
                if (isNaN(gukbap)){
                  let embed = new Discord.MessageEmbed()
                  .setColor('#de0b43')
                  .setTitle('국밥 계산기')
                  .setDescription('')
                  .addField(':exclamation:  에러 발생', '에러 코드 0x03: 문자는 입력할 수 없어!', true)
                  message.channel.send(embed)
                }
                else if (gukbap == Number.POSITIVE_INFINITY){
                  let embed = new Discord.MessageEmbed()
                  .setColor('#de0b43')
                  .setTitle('국밥 계산기')
                  .setDescription('')
                  .addField(':exclamation:  에러 발생', '에러 코드 0x04: 값이 무한대에 도달함!', true)
                  message.channel.send(embed)
                }
                else if (gukbap == Number.NEGATIVE_INFINITY){
                  let embed = new Discord.MessageEmbed()
                  .setColor('#de0b43')
                  .setTitle('국밥 계산기')
                  .setDescription('')
                  .addField(':exclamation:  *이스터에그 발견*', '제목: 흙수저\n\n이곳에 오게 되다니 너의 창의력은 정말 대단하구나.', false)
                  message.channel.send(embed)
                }
                else{
                  let embed = new Discord.MessageEmbed()
                    .setColor('#4fe8a3')
                    .setTitle('국밥 계산기')
                    .addField(args[1] + "원은...", gukbap + ' 국밥이야!', true)
                  message.channel.send(embed)
                }
            }
            break;
        case '버전':
        case '업데이트':
          let embed = new Discord.MessageEmbed()
            .setColor('#4fe8a3')
            .setTitle('업데이트 사항')
            .setDescription('')
            .addField('최근 업데이트: ', VERSION, true)
          message.channel.send(embed)
            break;
        case '전적':
            if (!args[1]){
              let embed = new Discord.MessageEmbed()
                .setColor('#4fe8a3')
                .setTitle('롤 전적 검색')
                .setDescription('')
                .addField('사용: ', '`!전적 <닉네임>` 입력해!', true)
              message.channel.send(embed)
            }
            else {
                if (message.content.indexOf('.') != -1 || message.content.indexOf('/') != -1) {
                  let embed = new Discord.MessageEmbed()
                  .setColor('#de0b43')
                  .setTitle('롤 전적 검색')
                  .setDescription('')
                  .addField(':exclamation:  에러 발생', '에러 코드 0x05: 어머 지금 LFI 취약점 하려구? 그건 안돼 !!', true)
                  message.channel.send(embed)
                  break;
                }
                var url = 'https://www.op.gg/summoner/userName=' + (encodeURI(args[1]));

                request(url, (error, response, html) => {
                    if (!error && response.statusCode == 200) {
                        const $ = cheerio.load(html);
                        try {
                            var ranktype = $(".RankType")[0].children[0].data;
                        } catch (e) {
                          let embed = new Discord.MessageEmbed()
                          .setColor('#de0b43')
                          .setTitle('롤 전적 검색')
                          .setDescription('')
                          .addField(':exclamation:  에러 발생', '에러 코드 0x06: 존재하지 않는 닉네임!', true)
                          message.channel.send(embed)
                        }
                        try { var tierrank = $(".TierRank")[0].children[0].data.trim() } catch (e) { }
                        try { var win = $(".win")[0].children[0].data; } catch (e) { }
                        try { var lose = $(".lose")[0].children[0].data; } catch (e) { }
                        var kda =""
                        for (var i=1;i<=5;i++){
                          try { kda+=$("#SummonerLayoutContent > div.tabItem.Content.SummonerLayoutContent.summonerLayout-summary > div.RealContent > div > div.Content > div.GameItemList > div:nth-child(" + i + ") > div > div.Content > div.KDA > div.KDA > span.Kill")[0].children[0].data + '/'; }
                          catch (e) { break; }
                          kda+=$("#SummonerLayoutContent > div.tabItem.Content.SummonerLayoutContent.summonerLayout-summary > div.RealContent > div > div.Content > div.GameItemList > div:nth-child(" + i + ") > div > div.Content > div.KDA > div.KDA > span.Death")[0].children[0].data + '/';
                          kda+=$("#SummonerLayoutContent > div.tabItem.Content.SummonerLayoutContent.summonerLayout-summary > div.RealContent > div > div.Content > div.GameItemList > div:nth-child(" + i + ") > div > div.Content > div.KDA > div.KDA > span.Assist")[0].children[0].data + '\n';
                        }
                        if (ranktype !== undefined) {
                          let embed = new Discord.MessageEmbed()
                            .setColor('#4fe8a3')
                            .setTitle('롤 전적 검색')
                            .addField(args[1] + "의 전적",'랭크 타입: ' + ranktype + '\n랭크: ' + tierrank + '\n최근 20경기: ' + win + '승 ' + lose + '패 (승률 ' + Math.floor(win / 20 * 100) + '%)', false)
                            .addField('최근 5경기', kda, false)
                          message.channel.send(embed)
                        }
                    }
                    else if (response.statusCode == 400) {
                      let embed = new Discord.MessageEmbed()
                      .setColor('#de0b43')
                      .setTitle('롤 전적 검색')
                      .setDescription('')
                      .addField(':exclamation:  *이스터에그 발견*', '제목: 400\n\nop.gg에 비정상적인 쿼리를 보내는데 성공!', false)
                      message.channel.send(embed)
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
                    var no_comma = parseInt($(".info_num")[0].children[0].data.replace(/,/g, ""));
                    var death = $(".info_num")[3].children[0].data;

                    let embed = new Discord.MessageEmbed()
                    .setColor('#4fe8a3')
                    .setTitle('코로나19 확진자 현황')
                    .setDescription('')
                    .addField('국내 확진자','국내 확진자: ' + $(".info_num")[0].children[0].data + '명', false)
                    .addField('격리 해제','격리 해제: ' + $(".info_num")[2].children[0].data + '명', false)
                    .addField('검사 진행 중','검사 진행 중: ' + $(".info_num")[1].children[0].data + '명', false)
                    .addField('사망','사망: ' + $(".info_num")[3].children[0].data + '명', false)
                    .addField('국내 치사율','국내 치사율: ' + death / no_comma * 100 + '%', false)
                    message.channel.send(embed)
                }
            });
            break;
        case '카트':
            if (!args[1])
                message.channel.send('카트 전적을 검색할 닉네임을 입력해! `!카트 <닉네임> [대전 형태 (개인전, 팀전)]`\n카트 대결 시뮬레이션을 하고 싶다면 `!카트 대결 <닉네임>` 을 입력해!');
            else {
                if (args[1] != '대결') {
                    if (!args[2])
                        message.channel.send('https://tmi.nexon.com/kart/user?nick=' + args[1]);
                    else if (args[2] == '개인' || args[2] == '개인전')
                        message.channel.send('https://tmi.nexon.com/kart/user?nick=' + args[1] + '&matchType=indi');
                    else if (args[2] == '팀' || args[2] == '팀전')
                        message.channel.send('https://tmi.nexon.com/kart/user?nick=' + args[1] + '&matchType=team');
                    else
                        message.channel.send('잘못 입력했어!');
                } else {
                    if (args[2])
                        message.channel.send('https://tmi.nexon.com/simulator/' + args[2]);
                    else
                        message.channel.send('닉네임을 입력해!');
                }

            }
            break;
        case '마스크':
          message.channel.send(new Discord.MessageEmbed()
          .setColor('#de0b43')
          .setTitle('약국별 마스크 물량')
          .setDescription('')
          .addField('지원 종료 안내','마스크 물량 검색 서비스 지원이 종료되었습니다.', false)
        )

        /*
            if (!args[1])
                message.channel.send('검색할 주소를 입력해! `!마스크 <도> <시/군/구> [동]`');
            else {
                if (!args[2])
                    message.channel.send('세부 주소를 입력해줘 (시,군,구)');
                else {
                    if (!args[3])
                        message.channel.send('봇 내부 오류로 인해 주소를 조금만 더 세분화 해주겠니? 조만간 수정할게!');
                    else {
                        var url = (encodeURI('https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=' + args[1] + ' ' + args[2] + ' ' + args[3]));
                        console.log(url);
                        request(
                            url,
                            (error, response, html) => {
                                if (!error && response.statusCode == 200) {
                                    const obj = JSON.parse(html);
                                    if (obj.count == 0) {
                                        message.channel.send('존재하지 않는 지역이거나 약국이 없습니다!');
                                    } else {
                                      let embed = new Discord.MessageEmbed()
                                      embed.setColor('#4fe8a3')
                                      embed.setTitle('약국별 마스크 물량')
                                      embed.setDescription('')
                                        for (var i = 0; i < obj.count; i++) {
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
                                            //var printStr = obj.stores[i].name + ' - ' + remain + ' (재입고 ' + tmp1[1] + '월' + tmp3[0] + '일 ' + tmp3[1] + '시 ' + tmp2[1] + '분)';

                                            embed.addField(obj.stores[i].name,remain + ' (재입고 ' + tmp1[1] + '월' + tmp3[0] + '일 ' + tmp3[1] + '시 ' + tmp2[1] + '분)', false)
                                            message.channel.send(embed)
                                            //message.channel.send(printStr);
                                        }
                                    }
                                }
                            }
                        );
                    }
                }
            }*/
            break;


        case '시간표':
            if (!args[1])
                message.channel.send('요일에 따라 자동으로 불러오는 디미고 시간표! 반을 입력해줘!\n예시: `!시간표 2`');
            else {
                if (args[1] == '1' || args[1] == '2' || args[1] == '3' || args[1] == '5' || args[1] == '6')
                    message.channel.send(args[1] + '반 시간표는 지원하지 않아!');
                else if (args[1] == 4) {
                    var d = new Date();
                    if (d.getDay() == 0 || d.getDay() == 6)
                        message.channel.send('오늘은 수업이 없는 날이야!');
                    else if (d.getDay() == 1)
                        message.channel.send('영어 - <https://bit.ly/3eBP6fj>\n과학	- <https://bit.ly/2KlKyMr>\n플밍A - <https://bit.ly/3eHLNDl>\n컴시 - <https://bit.ly/2VrQlGt>\n체육	- <https://bit.ly/3eHaZtA>\n국어 - <https://bit.ly/34Quo79>\n사회 - 구글 캘린더 확인');
                    else if (d.getDay() == 2)
                        message.channel.send('플밍B	- <https://bit.ly/3bmOPuK>\n수학 - <https://bit.ly/2RUZ6GV>\n국어 - <https://bit.ly/34Quo79>\n영어 - <https://bit.ly/3eBP6fj>\n컴일	- <https://bit.ly/2VrQlGt>\n진로 - <https://bit.ly/353S1t7>\n CA (동아리)');
                    else if (d.getDay() == 3)
                        message.channel.send('수학 - <https://bit.ly/2RUZ6GV>\n사회 - 구글 캘린더 확인\n과학 - <https://bit.ly/2KlKyMr>\n국어 - <https://bit.ly/34Quo79>\n플밍A - <https://bit.ly/3eHLNDl>\n플밍A - <https://bit.ly/3eHLNDl>\n');
                    else if (d.getDay() == 4)
                        message.channel.send('미술 - <https://bit.ly/353S1t7>\n체육 - <https://bit.ly/3eHaZtA>\n사회 - 구글 캘린더 확인\n수학 - <https://bit.ly/2RUZ6GV>\n영어 - <https://bit.ly/3eBP6fj>\n플밍A - <https://bit.ly/3eHLNDl>\nHR (학급 시간)');
                    else if (d.getDay() == 5)
                        message.channel.send('과학 - <https://bit.ly/2KlKyMr>\n컴일 - <https://bit.ly/2VrQlGt>\n플밍B - <https://bit.ly/3bmOPuK>\n플밍B - <https://bit.ly/3bmOPuK>\n미술 - <https://bit.ly/353S1t7>\n미술 - <https://bit.ly/353S1t7>\n진로 - <https://bit.ly/353S1t7>');
                    else
                        message.channel.send('오류 발생!');
                } else {
                    message.channel.send(args[1] + '반은 없는 반이야...');
                }
            }
            break;
        /*
        case '번역':
            request('https://translate.google.co.kr/?hl=ko#view=home&op=translate&sl=en&tl=ko&text=Hello', (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(html);
                    message.channel.send(html)
                }
            });
            break;
        */
        case '업타임':
        case 'uptime':
          message.channel.send(new Discord.MessageEmbed()
          .setColor('#4fe8a3')
          .setTitle('업타임')
          .setDescription('')
          .addField('리오봇이 켜진 지...',`${uptime_day}일 ${uptime_hour}시간 ${uptime_min}분 ${uptime_sec}초가 지났어!`, false)
        )
          break;
        case '디미':
            if (!args[1])
                message.channel.send('```!디미 서버이름\n!디미 초대코드\n!디미 공지```');
            else {
                if (args[1] == '서버이름')
                    request('https://discordapp.com/api/guilds/665163164471787530/widget.json', (error, response, html) => {
                        if (!error && response.statusCode == 200) {
                            const obj = JSON.parse(html);
                            message.channel.send(obj.name);
                        }
                    });
                else if (args[1] == '초대코드') {
                    request('https://discordapp.com/api/guilds/665163164471787530/widget.json', (error, response, html) => {
                        if (!error && response.statusCode == 200) {
                            const obj = JSON.parse(html);
                            message.channel.send(obj.instant_invite);
                        }
                    });
                }
                else if (args[1] == '공지') {
                    request('https://www.dimigo.hs.kr/index.php?mid=school_notice', (error, response, html) => {
                        if (!error && response.statusCode == 200) {
                            const $ = cheerio.load(html);
                            let embed = new Discord.MessageEmbed()
                            .setColor('#ec137f')
                            .setTitle('디미고 공지')
                            .setDescription('')
                            .addField(($("#dimigo_post_cell_2 > tr:nth-child(1) > td.title > div > a")[0].children[0].data), ($("#dimigo_post_cell_2 > tr:nth-child(1) > td.title > div > a").attr("href")), false)
                            .addField(($("#dimigo_post_cell_2 > tr:nth-child(2) > td.title > div > a")[0].children[0].data), ($("#dimigo_post_cell_2 > tr:nth-child(2) > td.title > div > a").attr("href")), false)
                            .addField(($("#dimigo_post_cell_2 > tr:nth-child(3) > td.title > div > a")[0].children[0].data), ($("#dimigo_post_cell_2 > tr:nth-child(3) > td.title > div > a").attr("href")), false)
                            .addField(($("#dimigo_post_cell_2 > tr:nth-child(4) > td.title > div > a")[0].children[0].data), ($("#dimigo_post_cell_2 > tr:nth-child(4) > td.title > div > a").attr("href")), false)
                            .addField(($("#dimigo_post_cell_2 > tr:nth-child(5) > td.title > div > a")[0].children[0].data), ($("#dimigo_post_cell_2 > tr:nth-child(5) > td.title > div > a").attr("href")), false)
                            message.channel.send(embed)
                        }
                    });
                }

            }

            break;
        case '급식':
            new Date();
            var date = new Date();
            var meal_year = date.getFullYear();
            var meal_month = new String(date.getMonth() + 1);
            var meal_day = new String(date.getDate());
            if (meal_month.length == 1)
                meal_month = "0" + meal_month;
            if (meal_day.length == 1)
                meal_day = "0" + meal_day;
            try {
                var meal_url = 'https://api.dimigo.in/dimibobs/' + meal_year + meal_month + meal_day;
            }
            catch (e) {

            }
            if (!args[1]){
              message.channel.send(new Discord.MessageEmbed()
              .setColor('#4fe8a3')
              .setTitle('디미고 급식')
              .setDescription('')
              .addField('사용법', '`!급식 <시간> [날짜]`' ,false)
            )
            }
            else if (args[1]) {
                function meal_print() {
                    if (args[1] == '아침') {
                        request(meal_url, (error, response, html) => {
                          const meal = JSON.parse(html);
                            if (!error && response.statusCode == 200) {
                              if (meal.breakfast === undefined){
                                message.channel.send(new Discord.MessageEmbed()
                                .setColor('#de0b43')
                                .setTitle('디미고 급식')
                                .setDescription('')
                                .addField(':exclamation:  에러 발생', '에러 코드 0x11: 급식 데이터가 없어!', true)
                              )
                              }
                              else {
                                var repl = meal.breakfast.replace(/\//gi, '\n');
                                if (!args[2]){
                                  message.channel.send(new Discord.MessageEmbed()
                                  .setColor('#4fe8a3')
                                  .setTitle('디미고 급식')
                                  .setDescription('')
                                  .addField(`${meal_month}월 ${meal_day}일 아침 메뉴`, `${repl}` ,false)
                                )
                                }
                                else {
                                  message.channel.send(new Discord.MessageEmbed()
                                  .setColor('#4fe8a3')
                                  .setTitle('디미고 급식')
                                  .setDescription('')
                                  .addField(args[2].slice(4, 6) + '월' + args[2].slice(6) + '일 아침메뉴', `${repl}` ,false)
                                )
                                }
                              }
                            }
                        });
                    }
                    else if (args[1] == '점심') {
                        request(meal_url, (error, response, html) => {
                          const meal = JSON.parse(html);
                            if (!error && response.statusCode == 200) {
                              if (meal.lunch === undefined){
                                message.channel.send(new Discord.MessageEmbed()
                                .setColor('#de0b43')
                                .setTitle('디미고 급식')
                                .setDescription('')
                                .addField(':exclamation:  에러 발생', '에러 코드 0x11: 급식 데이터가 없어!', true)
                              )
                              }
                              else {
                                var repl = meal.lunch.replace(/\//gi, '\n');
                                if (!args[2]){
                                  message.channel.send(new Discord.MessageEmbed()
                                  .setColor('#4fe8a3')
                                  .setTitle('디미고 급식')
                                  .setDescription('')
                                  .addField(`${meal_month}월 ${meal_day}일 아침 메뉴`, `${repl}` ,false)
                                )
                                }
                                else {
                                  message.channel.send(new Discord.MessageEmbed()
                                  .setColor('#4fe8a3')
                                  .setTitle('디미고 급식')
                                  .setDescription('')
                                  .addField(args[2].slice(4, 6) + '월' + args[2].slice(6) + '일 점심메뉴', `${repl}` ,false)
                                )
                                }
                              }
                            }
                        });
                    }
                    else if (args[1] == '저녁') {
                        request(meal_url, (error, response, html) => {
                          const meal = JSON.parse(html);
                          console.log(meal.dinner);
                            if (!error && response.statusCode == 200) {
                              if (meal.dinner === undefined){
                                message.channel.send(new Discord.MessageEmbed()
                                .setColor('#de0b43')
                                .setTitle('디미고 급식')
                                .setDescription('')
                                .addField(':exclamation:  에러 발생', '에러 코드 0x11: 급식 데이터가 없어!', true)
                              )
                              }
                              else {
                                var repl = meal.dinner.replace(/\//gi, '\n');
                                if (!args[2]){
                                  message.channel.send(new Discord.MessageEmbed()
                                  .setColor('#4fe8a3')
                                  .setTitle('디미고 급식')
                                  .setDescription('')
                                  .addField(`${meal_month}월 ${meal_day}일 아침 메뉴`, `${repl}` ,false)
                                )
                                }
                                else{
                                  message.channel.send(new Discord.MessageEmbed()
                                  .setColor('#4fe8a3')
                                  .setTitle('디미고 급식')
                                  .setDescription('')
                                  .addField(args[2].slice(4, 6) + '월' + args[2].slice(6) + '일 점심메뉴', `${repl}` ,false)
                                )
                                }
                              }
                            }
                        });
                    }
                    else {
                      message.channel.send(new Discord.MessageEmbed()
                      .setColor('#de0b43')
                      .setTitle('디미고 급식')
                      .setDescription('')
                      .addField(':exclamation:  에러 발생', '에러 코드 0x10: 시간은 아침, 점심, 저녁을 입력해줘!', true)
                    )
                    }
                }
                if (args[2] && args[2].length == 8) {
                    var meal_url = 'https://api.dimigo.in/dimibobs/' + args[2];
                    meal_print();
                }
                else if (args[2] && args[2].length != 8){
                  message.channel.send(new Discord.MessageEmbed()
                  .setColor('#de0b43')
                  .setTitle('디미고 급식')
                  .setDescription('')
                  .addField(':exclamation:  에러 발생', '에러 코드 0x11: YYYYMMDD 형태로 입력해줘!', true)
                )
                }
                else
                    meal_print();
            }
            break;
        case 'auth':
            if (!args[1])
                message.channel.send('plz enter flag');
            else {
                if (args[1] === 'FLAG{n1ce_work!}')
                    message.author.send('You solved prob1 - My LAN security!');
                else if (args[1] === 'FLAG{too_easypeasylemonsqueazy}')
                    message.author.send('You solved prob2 - Ancient Rome');
                else if (args[1] === 'FLAG{Hell' && args[2] === 'World}')
                    message.author.send('You solved prob3 - Blank');
                else if (args[1] === 'FLAG{ohhh_s0rry_pr0b1em_w45_t00_d1r7y}')
                    message.author.send('You solved prob4 - ANG')
                else if (args[1] === 'FLAG{simple_b4se}')
                    message.author.send('You solved prob5 - Simple Base');
                else if (args[1] === 'FLAG{5ab6dff48eab2df60fee6f8110b5baf7}')
                    message.author.send('You solved prob6 - Find the hacker')
                else if (args[1] === 'FLAG{3be8d0e59b9e23c9376f31b05d61697ccab55552}')
                    message.author.send('You solved prob7 - Forensic - Ultimate Evidence')
            }
            break;
        case 'ctf':
        case 'CTF':
            if (!args[1])
                message.channel.send("Welcome to Devleo's CTF!!\n`ex) !ctf 1`");
            else {
                if (args[1] == '1')
                    message.channel.send('```cs\n# CRYPTO - My LAN security!\n\nciphertext = IKIQIFILLPKSHFKHKJJTLLKTLGKPGFLR\noffset = 69\n\nHint 1: This crypto is related to one of the OSI model 7 layers.\nHint 2: It allows applications on separate computers to communicate over a LAN.```');
                else if (args[1] == '2')
                    message.channel.send('```cs\n# CRYPTO - Ancient Rome\n\nciphertext = SYNT{gbb_rnflcrnflyrzbafdhrnml}```');
                else if (args[1] == '3')
                    message.channel.send('```cs\n# CRYPTO - Blank\n\nciphertext = SSSTSSSSSSTSLSSSTTTSTTSSSTTSSTSLSSSSLTTSSSSTSSTSSSLTLSSSSSTTSSTSTLTLSSSSSTTSTTSSLSLSTLSSLSSSSSTTSTTTTLTLSSSSSTSSSSSLTLSSSSSTSTSTTTLTLSSSSSTTSTTTTLTLSSSSSTTTSSTSLTLSSSSSTTSTTSSLTLSSSSSTTSSTSSLTLSSSSSTSSSSTLSSSSSTSTSLTLSSSLLLLL```')
                else if (args[1] == '4')
                    message.channel.send("```cs\n# MISC - ANG\n\nhttp://ctf2.devleo.us```");
                else if (args[1] == '5')
                    message.channel.send('```cs\n# CRYPTO - Simple Crypto\n\nciphertext=8QnVQ6W,]r:JOnk1,MBn9ib(l78?6M9ia/L4Ztqk```');
                else if (args[1] == '6')
                    message.channel.send('```cs\n# Network - Find the hacker!\n\n한 천재 해커가 어떤 웹사이트에 접속해서 정보를 빼내려고 해..\n그 웹사이트는 어디일까? 그 해커의 세션은 몇 초 뒤에 만료될까?\n파일1: http://di.do/3y8\n\n좋아! 해커가 접속한 곳을 알아내는데 성공했어!\n그러면 해커가 비밀 통신을 위해 사용한 네트워크를 알아보자.\n그 사람은 집에 있는 공유기를 연결해서 통신했다고 하는데...\n파일 2: http://di.do/WM6\n\n이런! 우리가 추적하는 것을 해커가 알아차렸나봐..\n해커는 다른 곳으로 대피를 했는데 이곳에서 단서를 찾으면 그를 잡을 수 있을거야!\n파일 3: http://di.do/z2t\n\n해커를 검거하는데 성공했어!!\n너희들의 도움이 없었다면 전세계 사람들의 개인정보가 유출되었을텐데.. 정말 고마워!\n아래는 선물이야!\nh4cker_1s_arre5ted!!!\n\nFLAG format: FLAG{md5(웹사이트 주소_세션 만료까지 시간 (초)_제조사_공유기 이름_범용 고유 식별자_파일3 플래그_h4cker_1s_arre5ted!!!)}```');
                else if (args[1] == '7')
                    message.channel.send('```py\nForensic - Ultimate Evidence\n\n한 천재 해커가 국가 기밀 문서가 담긴 "USB" 를 자신의 컴퓨터에 꽂고 "자신이 좋아하는 사이트" 에 접속해 불법 행위를 하고 "지하철로 달아났다". 아래의 증거들을 수집하자!\n\nhttps://bit.ly/32Heuv7\n\n1. 컴퓨터 최초 부팅 시각 ex) 2020/01/01 12:34:56\n2. 해커가 좋아하는 사이트 ex) google.com\n3. usb를 꽂은 시각 ex) 2020/01/01 12:34:56\n4. usb 시리얼 넘버\n5. usb 제조사\n6. 출발한 지하철 역\n7. 도착한 지하철 역\n\n모든 증거들은 형식에 맞춰 "영어 소문자 및 숫자" 로 아래와 같이 입력하고 sha1 로 변환한다.\nFLAG{sha1(증거1_증거2_증거3_증거4_증거5_증거6_증거7)}\n```')
            }
            break;
        case '택배':
          message.channel.send(new Discord.MessageEmbed()
          .setColor('#de0b43')
          .setTitle('택배 조회 서비스')
          .setDescription('')
          .addField('지원 종료 안내','택배 조회 서비스 지원이 종료되었습니다.', false)
        )

        /*
            if (!args[1])
                message.channel.send('운송장 번호를 입력해! (우체국택배)');
            else {
                var delivery_url = 'https://apis.tracker.delivery/carriers/kr.epost/tracks/' + args[1]
                request(delivery_url, (error, response, html) => {
                    if (!error && response.statusCode == 200) {
                        const delivery = JSON.parse(html);
                        message.channel.send(`받는 사람: ${delivery.to.name}\n\n배송 진행상태\n`);
                        for (var i = 0; i < 7; i++)
                            //message.channel.send(`${i}. ${delivery.progresses.location.name[i]} ${delivery.progresses.text[i]} (${delivery.progresses.description[i]})`);
                            message.channel.send(i + 1 + '. ' + delivery.progresses[i].location.name + '-' + delivery.progresses[i].description + ' (' + delivery.progresses[i].time.split('+')[0] + ')');
                    }
                    else
                        message.channel.send('서버에 문제가 생겼거나 존재하지 않는 운송장 번호야!');
                });
            }*/
            break;
        case 'osu':
        case '오수':
            if (!args[1]){
              message.channel.send(new Discord.MessageEmbed()
              .setColor('#4fe8a3')
              .setTitle('osu! 전적 검색')
              .setDescription('')
              .addField('닉네임 또는 ID (필수) 와 모드 (선택) 를 입력해줘!', '```0 = std\n1 = taiko\n2 = CtB\n3 = mania```' ,false)
            )
            }
            else {
                if (args[2])
                    var osu_url = 'https://osu.ppy.sh/api/get_user?u=' + args[1] + '&k=20e07253c789e68f4789dcd215ff2aac5174e2f4&m=' + args[2];
                else
                    var osu_url = 'https://osu.ppy.sh/api/get_user?u=' + args[1] + '&k=20e07253c789e68f4789dcd215ff2aac5174e2f4';
                request(osu_url, (error, response, html) => {
                    if (!error && response.statusCode == 200) {
                        const osu = JSON.parse(html);
                        if (html == '[]'){
                          message.channel.send(new Discord.MessageEmbed()
                          .setColor('#de0b43')
                          .setTitle('osu! 전적 검색')
                          .setDescription('')
                          .addField(':exclamation:  에러 발생', '에러 코드 0x06: 존재하지 않는 닉네임!', true)
                        )
                        }
                        else {
                            var second = osu[0].total_seconds_played;
                            var hour, min, sec
                            hour = parseInt(second / 3600);
                            min = parseInt((second % 3600) / 60);
                            sec = second % 60;
                            if (hour.toString().length == 1) hour = "0" + hour;
                            if (min.toString().length == 1) min = "0" + min;
                            if (sec.toString().length == 1) sec = "0" + sec;
                            if (args[2] == undefined || args[2] == 0){
                              message.channel.send(new Discord.MessageEmbed()
                              .setColor('#4fe8a3')
                              .setTitle('osu! 전적 검색')
                              .setDescription('')
                              .addField(`${osu[0].username} 의 Std 전적`, `레벨: ${osu[0].level}\n플레이 횟수: ${osu[0].playcount}\n플레이 시간: ${hour}시간 ${min}분 ${sec}초\n가입 날짜: ${osu[0].join_date}\n\n획득 점수: ${osu[0].total_score}\n랭킹: ${osu[0].pp_rank}\n국가 랭킹: ${osu[0].pp_country_rank}\npp: ${osu[0].pp_raw}\n정확도: ${osu[0].accuracy}\n` ,false)
                            )
                            }
                            else if (args[2] == 1){
                              message.channel.send(new Discord.MessageEmbed()
                              .setColor('#4fe8a3')
                              .setTitle('osu! 전적 검색')
                              .setDescription('')
                              .addField(`${osu[0].username} 의 Taiko 전적`, `레벨: ${osu[0].level}\n플레이 횟수: ${osu[0].playcount}\n플레이 시간: ${hour}시간 ${min}분 ${sec}초\n가입 날짜: ${osu[0].join_date}\n\n획득 점수: ${osu[0].total_score}\n랭킹: ${osu[0].pp_rank}\n국가 랭킹: ${osu[0].pp_country_rank}\npp: ${osu[0].pp_raw}\n정확도: ${osu[0].accuracy}\n` ,false)
                            )
                            }
                            else if (args[2] == 2){
                              message.channel.send(new Discord.MessageEmbed()
                              .setColor('#4fe8a3')
                              .setTitle('osu! 전적 검색')
                              .setDescription('')
                              .addField(`${osu[0].username} 의 Catch 전적`, `레벨: ${osu[0].level}\n플레이 횟수: ${osu[0].playcount}\n플레이 시간: ${hour}시간 ${min}분 ${sec}초\n가입 날짜: ${osu[0].join_date}\n\n획득 점수: ${osu[0].total_score}\n랭킹: ${osu[0].pp_rank}\n국가 랭킹: ${osu[0].pp_country_rank}\npp: ${osu[0].pp_raw}\n정확도: ${osu[0].accuracy}\n` ,false)
                            )
                            }
                            else if (args[2] == 3){
                              message.channel.send(new Discord.MessageEmbed()
                              .setColor('#4fe8a3')
                              .setTitle('osu! 전적 검색')
                              .setDescription('')
                              .addField(`${osu[0].username} 의 Mania 전적`, `레벨: ${osu[0].level}\n플레이 횟수: ${osu[0].playcount}\n플레이 시간: ${hour}시간 ${min}분 ${sec}초\n가입 날짜: ${osu[0].join_date}\n\n획득 점수: ${osu[0].total_score}\n랭킹: ${osu[0].pp_rank}\n국가 랭킹: ${osu[0].pp_country_rank}\npp: ${osu[0].pp_raw}\n정확도: ${osu[0].accuracy}\n` ,false)
                            )
                            }
                            else {
                              message.channel.send(new Discord.MessageEmbed()
                              .setColor('#de0b43')
                              .setTitle('osu! 전적 검색')
                              .setDescription('')
                              .addField(':exclamation:  에러 발생', '에러 코드 0x07: 모드 입력이 올바르지 않습니다. ```0 = std\n1 = taiko\n2 = catch\n3 = mania```', true)
                            )
                            }

                        }
                    }
                    else
                      message.channel.send(new Discord.MessageEmbed()
                      .setColor('#de0b43')
                      .setTitle('osu! 전적 검색')
                      .setDescription('')
                      .addField(':exclamation:  에러 발생', '에러 코드 0x08: 서버 접속 오류!', true)
                    )
                });
            }
            break;
        case 'codeup':
        case '코드업':
            if (!args[1])
                message.channel.send('사용법: `!코드업 <닉네임>`');
            else {
                request("https://codeup.kr/userinfo.php?user=" + args[1], (error, response, html) => {
                    if (!error && response.statusCode == 200) {
                        const $ = cheerio.load(html);
                        try { var name = $(".d-inline > strong > a > span")[0].children[0].data; } catch(e) { }
                        try { var cd_rank = $("body > main > div.container.mt-2 > div.row > div.col-md-12.col-lg-4 > table > tbody > tr:nth-child(1) > td.text-center")[0].children[0].data.replace(/ /g, "\n"); } catch (e) { }
                        try { cd_rank = cd_rank.trim(); } catch (e) { }
                        console.log(cd_rank);
                        try { var solved = $(".text-center > a")[0].children[0].data; }
                        catch (e) { }
                        try { var submit = $(".text-center > a")[1].children[0].data; } catch(e) { }
                        try { var correct = $("body > main > div.container.mt-2 > div.row > div.col-md-12.col-lg-4 > table > tbody > tr:nth-child(4) > td:nth-child(2) > a")[0].children[0].data; } catch (e) { }
                        finally {
                          if (submit !== undefined && correct !== undefined){
                            message.channel.send(new Discord.MessageEmbed()
                            .setColor('#4fe8a3')
                            .setTitle('CodeUp 전적 검색')
                            .setDescription('')
                            .addField(`${name} 의 CodeUp 전적`, `순위: ${cd_rank}\n푼 문제 수: ${solved}\n제출 횟수: ${submit}\n정확한 풀이: ${correct}` ,false)
                          )
                          }
                          else if ($("body > main > div")[0].children[0].data.trim() == '그런 사용자는 없습니다!'){
                            message.channel.send(new Discord.MessageEmbed()
                            .setColor('#de0b43')
                            .setTitle('CodeUp 전적 검색')
                            .setDescription('')
                            .addField(':exclamation:  에러 발생', '에러 코드 0x06: 존재하지 않는 닉네임!', true)
                            )
                          }
                          else {
                            try {
                              if ($("body > main > div.container.mt-2 > blockquote > footer > span")[0].children[0].data.trim() == '탈퇴한 회원'){
                                message.channel.send(new Discord.MessageEmbed()
                                .setColor('#de0b43')
                                .setTitle('CodeUp 전적 검색')
                                .setDescription('')
                                .addField(':exclamation:  에러 발생', '에러 코드 0x09: 탈퇴한 회원입니다!', true)
                                )
                              }
                            }
                            catch(e) {}
                          }
                      }
                }
              });
            }
            break;
        case 'github':
        case '깃허브':
          if (!args[1])
            message.channel.send('사용법: `!github <username>`');
          else {
            var options = {
                'method': 'GET',
                'url': 'https://api.github.com/users/' + args[1],
                'headers': {
                    'Authorization': 'token ' + github_token,
                    'User-Agent': 'test-api'
                },
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);{
                  const data = JSON.parse(response.body);
                  if (data.name != null){
                    if (data.hireable == true){
                      var hireable_emoji = ':regional_indicator_o:';
                    }
                    else {
                      var hireable_emoji = ':regional_indicator_x:';
                    }
                    try { data.bio = data.bio.trim(); } catch (e) { }
                    message.channel.send(new Discord.MessageEmbed()
                    .setColor('#4fe8a3')
                    .setTitle('Github 사용자 검색')
                    .setDescription('')
                    .addField(`${data.name} 의 정보`, `소개: ${data.bio}\n소속: ${data.company}\n웹페이지: ${data.blog}\n위치: ${data.location}\n코딩노예가 될 준비: ${hireable_emoji}` ,false)
                    )
                  }
                  else {
                    message.channel.send(new Discord.MessageEmbed()
                    .setColor('#de0b43')
                    .setTitle('Github 사용자 검색')
                    .setDescription('')
                    .addField(':exclamation:  에러 발생', '에러 코드 0x06: 존재하지 않는 닉네임!', true)
                    )
                  }
                }
            });
          }
          break;
    }
})

bot.on('message', msg => {
    /*
    function timer_meal(time) {
        new Date();
        var date = new Date();
        var meal_year = date.getFullYear();
        var meal_month = new String(date.getMonth() + 1);
        var meal_day = new String(date.getDate());
        if (meal_month.length == 1)
            meal_month = "0" + meal_month;
        if (meal_day.length == 1)
            meal_day = "0" + meal_day;
        var meal_url = 'https://api.dimigo.in/dimibobs/' + meal_year + meal_month + meal_day;
        console.log(meal_url);
        request(meal_url, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const meal = JSON.parse(html);
                if (time == 'breakfast')
                    return meal.breakfast;
                else if (time == 'lunch')
                    return meal.lunch;
                else
                    return meal.dinner;
            }
        })
    }
    */
    if (msg.content === '안녕' || msg.content === 'ㅎㅇ' || msg.content === 'gd' || msg.content === 'ㅎㅇㅎㅇ' || msg.content === 'gdgd' || msg.content === 'GD' || msg.content === 'GDGD')
        msg.channel.send(`${msg.author} 안녕 친구!`);
    else if (msg.content === '!help' || msg.content === '리오야 도움')
        msg.channel.send("```cs\n#리오봇 도움말\n\n#기본 도움말\n'리오야 도움' - 도움말 표시\n'안녕' - 당신에게 인사를 합니다.\n'!웹페이지' - 개발자의 웹페이지\n'!개발자' - 개발자 정보 표시\n'!버전' - 현재 버전 표시\n\n#유틸리티\n'!한강' - 현재 한강 수온 표시\n'!날씨' - 지역별 기온과 날씨 표시\n'!미세먼지' - 지역별 미세먼지 표시\n'!국밥' - 입력한 금액이 몇 국밥인지 계산\n'!비트코인, !가상화폐' - 대표 가상화폐 4종 현재 시세 표시\n'!일출, !일몰' - 지역별 일출, 일몰 시간 표시\n'!코로나' - 현재 국내 코로나19 확진자 정보, 예측 시스템 표시\n'!전적' - 롤 전적 검색\n'!카트' - 카트 전적 검색\n'!마스크' - 지역별 약국의 마스크 물량 검색\n'!시간표' - 디미고 오늘의 시간표\n'!디미' - discord api 관련 정보\n'!급식' - 디미고 급식 조회\n'!ctf' - 직접 제작한 워게임 모음\n'!auth' - FLAG authentication\n'!택배' - 우체국택배 배송상황 조회\n'mealbot on' - 자동 급식 알림 켜짐\n'!업타임' - 봇이 켜진 업타임 시간```");
    else if (msg.content === '엄')
        msg.channel.send('준\n식\n은\n살\n아\n있\n다');
    /*
    else if (msg.content === 'mealbot timer on') {
        msg.channel.send('자동 급식 타이머 on');
        if (msg.author.id != '671631736404180992')
            msg.channel.send('권한이 없습니다.');
        else {
            var x = setInterval(function () {
                var time = new Date();
                if (time.getHours == 8 && time.getMinutes == 10)
                    msg.channel.send('@here 아침식사 시간!\n' + timer_meal('breakfast'));
                else if (time.getHours == 13 && time.getMinutes == 10)
                    msg.channel.send('@here 점심식사 시간\n!' + timer_meal('lunch'));
                else if (time.getHours == 19 && time.getMinutes == 10)
                    msg.channel.send('@here 저녁식사 시간\n!' + timer_meal('dinner'));
                else if (time.getHours == 20 && time.getMinutes == 0)
                    msg.channel.send('@here 리오봇 테스트!!');
            }, 1 * 60000);
        }
    }
    */
    else if (msg.content.indexOf("'ㅅ'") != -1)
        msg.channel.send('이건 분명히 <@!320409075034619904> 가 말했을거야!');
})

bot.on('message', msg => {
    if (msg.content == 'exam timer on' && msg.author.id == '671631736404180992') {
        msg.channel.send("on");
        var x = setInterval(function () {
            var date = new Date();
            var month = new String(date.getMonth() + 1);
            var day = new String(date.getDate());
            var hour = date.getHours();
            var minute = date.getMinutes();

            if (month == 7 && day == 28 && hour == 12 && minute == 31) {
                request('http://hangang.dkserver.wo.tc', (error, response, html) => {
                    if (!error && response.statusCode == 200) {
                        const river = JSON.parse(html);
                        message.channel.send(`<@&665546529012187140> <@&665546572141953034> <@&665169439813140519> <@&665169466115620865> <@&665224019980714004> <&665224033863860225>\n1학기 2차 지필고사가 종료되었습니다! 모두 수고했다 얘들아\n\n한강 수온: ${river.temp}\n따끈따끈 하누 ㅋㅋ`);
                    }
                });
            }

        }, 60000);
    }
});

bot.on('message', msg => {
    if (msg.content == 'mealbot on' && mealbot_on_status == 0) {
        if (msg.author.id != '671631736404180992')
            msg.channel.send('권한이 없습니다.');
        else {
            mealbot_on_status = 1;
            msg.channel.send('on');
            var x = setInterval(function () {
                var date = new Date();
                var meal_year = date.getFullYear();
                var meal_month = new String(date.getMonth() + 1);
                var meal_day = new String(date.getDate());
                var meal_yo = date.getDay();
                if (meal_month.length == 1)
                    meal_month = "0" + meal_month;
                if (meal_day.length == 1)
                    meal_day = "0" + meal_day;
                try {
                    var meal_url = 'https://api.dimigo.in/dimibobs/' + meal_year + meal_month + meal_day;
                }
                catch (e) {

                }
                var hour = date.getHours();
                var minute = date.getMinutes();
                function meal_time_lunch() {
                    //if (date.getDay() != 5 && date.getDay() != 6) {
                    if (date.getMonth() == 6 && date.getDate() >= 24 && date.getDate() <= 30)
                        msg.channel.send('@4반 오늘 점심시간은 13:10 이야!');
                    else if (date.getMonth() == 7 && date.getDate() >= 1 && date.getDate() <= 7)
                        msg.channel.send('@4반 오늘 점심시간은 13:25 이야!');
                    else if (date.getMonth() == 7 && date.getDate() >= 8 && date.getDate() <= 14)
                        msg.channel.send('@4반 오늘 점심시간은 13:22 이야!');
                    else if (date.getMonth() == 7 && date.getDate() >= 15 && date.getDate() <= 21)
                        msg.channel.send('@4반 오늘 점심시간은 13:19 이야!');
                    else if (date.getMonth() == 7 && date.getDate() >= 22 && date.getDate() <= 28)
                        msg.channel.send('@4반 오늘 점심시간은 13:16 이야!');
                    else if (date.getMonth() == 7 && date.getDate() >= 29 || date.getMonth() == 8 && date.getDate() <= 4)
                        msg.channel.send('@4반 오늘 점심시간은 13:13 이야!');
                    //}
                }
                function meal_time_dinner() {
                    //if (date.getDay() != 5 && date.getDay() != 6) {
                    if (date.getMonth() == 6 && date.getDate() >= 24 && date.getDate() <= 30)
                        msg.channel.send('@4반 오늘 저녁시간은 19:30 이야!');
                    else if (date.getMonth() == 7 && date.getDate() >= 1 && date.getDate() <= 7)
                        msg.channel.send('@4반 오늘 저녁시간은 19:15 이야!');
                    else if (date.getMonth() == 7 && date.getDate() >= 8 && date.getDate() <= 14)
                        msg.channel.send('@4반 오늘 저녁시간은 19:18이야!');
                    else if (date.getMonth() == 7 && date.getDate() >= 15 && date.getDate() <= 21)
                        msg.channel.send('@4반 오늘 저녁시간은 19:21 이야!');
                    else if (date.getMonth() == 7 && date.getDate() >= 22 && date.getDate() <= 28)
                        msg.channel.send('@4반 오늘 저녁시간은 19:24 이야!');
                    else if (date.getMonth() == 7 && date.getDate() >= 29 || date.getMonth() == 8 && date.getDate() <= 4)
                        msg.channel.send('@4반 오늘 저녁시간은 19:27 이야!');
                    //}
                }
                if (meal_yo != 0 && meal_yo != 6) {
                    if (hour == 8 && minute == 0) {
                        request(meal_url, (error, response, html) => {
                            if (!error && response.statusCode == 200) {
                                const meal = JSON.parse(html);
                                var repl = meal.breakfast.replace(/\//gi, '\n');
                                msg.channel.send(`자동 급식 알림\n\n- ${meal_month}월 ${meal_day}일 아침 메뉴\n${repl}`);
                            }
                        });
                    }
                    else if (hour == 13 && minute == 0) {
                        request(meal_url, (error, response, html) => {
                            if (!error && response.statusCode == 200) {
                                const meal = JSON.parse(html);
                                var repl = meal.lunch.replace(/\//gi, '\n');
                                msg.channel.send(`자동 급식 알림\n\n- ${meal_month}월 ${meal_day}일 점심 메뉴\n${repl}`);
                                meal_time_lunch();
                            }
                        });
                    }
                    else if (hour == 18 && minute == 40) {
                        request(meal_url, (error, response, html) => {
                            if (!error && response.statusCode == 200) {
                                const meal = JSON.parse(html);
                                var repl = meal.dinner.replace(/\//gi, '\n');
                                msg.channel.send(`자동 급식 알림\n\n- ${meal_month}월 ${meal_day}일 저녁 메뉴\n${repl}`);
                                meal_time_dinner();
                            }
                        });
                    }
                }
                else {
                    if (hour == 7 && minute == 50) {
                        request(meal_url, (error, response, html) => {
                            if (!error && response.statusCode == 200) {
                                const meal = JSON.parse(html);
                                var repl = meal.breakfast.replace(/\//gi, '\n');
                                msg.channel.send(`자동 급식 알림\n\n- ${meal_month}월 ${meal_day}일 아침 메뉴\n${repl}`);
                            }
                        });
                    }
                    else if (hour == 11 && minute == 55) {
                        request(meal_url, (error, response, html) => {
                            if (!error && response.statusCode == 200) {
                                const meal = JSON.parse(html);
                                var repl = meal.lunch.replace(/\//gi, '\n');
                                msg.channel.send(`자동 급식 알림\n\n- ${meal_month}월 ${meal_day}일 점심 메뉴\n${repl}`);
                                meal_time_lunch();
                            }
                        });
                    }
                    else if (hour == 17 && minute == 55) {
                        request(meal_url, (error, response, html) => {
                            if (!error && response.statusCode == 200) {
                                const meal = JSON.parse(html);
                                var repl = meal.dinner.replace(/\//gi, '\n');
                                msg.channel.send(`자동 급식 알림\n\n- ${meal_month}월 ${meal_day}일 저녁 메뉴\n${repl}`);
                                meal_time_dinner();
                            }
                        });
                    }
                }
            }, 1 * 60000);
        }
    }
    else if (msg.content == 'mealbot on' && mealbot_on_status == 1)
        msg.channel.send('이미 자동 급식 알림이 켜져있습니다.');
});


bot.login(token);
