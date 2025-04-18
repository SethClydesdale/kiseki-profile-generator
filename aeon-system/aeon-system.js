(function (window, document) {
  'use strict';
  
  // Global used for telling if the site is being used offline with MS Edge (pre-chromium).
  // Helps prevent "unspecified errors" caused by checking for the existence of localStorage support offline.
  window.offlineEdge = window.location.protocol == 'file:' && /Edge/.test(navigator.userAgent);
  
  // Global used for checking localStorage support (ex: storageOK && localStorage.myStorageItem)
  // prevents long winded conditions everytime we want to use storage
  window.storageOK = navigator.cookieEnabled && !offlineEdge && window.localStorage ? true : false;
  
  
  window.AeonSystem = {
    // initial functions for page load
    kidou : function () {
      // automatically set language based on the url query (?lang=ja||en)
      var select = document.getElementById('info-lang');
      
      if (/lang=(?:en|ja)/.test(window.location.search.toLowerCase()) && select) {
        select.value = /ja/.test(window.location.search.toLowerCase()) ? 'ja' : 'en';
        select.dispatchEvent(new Event('change'));
      }
      
      // # OFFLINE LINK MODIFICATIONS #
      // appends index.html to links if this project is hosted on the local file system
      if (window.location.protocol == 'file:') {
        for (var a = document.getElementsByTagName('A'), i = 0, j = a.length; i < j; i++) {
          if (!/http/.test(a[i].href)) {
            if (/\/$/.test(a[i].href)) {
              a[i].href += 'index.html';
            } else if (/\/#.*?$/.test(a[i].href)) {
              a[i].href = a[i].href.replace(/(#.*?)$/, 'index.html$1');
            } else if (/\/\?.*?$/.test(a[i].href)) {
              a[i].href = a[i].href.replace(/(\?.*?)$/, 'index.html$1');
            }
          }
        }
      }
    },
    
    
    // profile data used for restoring state and saving locally to keep a backup
    profile : {
      // template background image
      lang : 'en',
      background : 'sora',
      avatar : 'estelle',
      avatarCustom : '',
      
      gender : 'null',
      
      // display name
      name : '',
      nameColor : '#333333',
      
      // twitter id
      handle : '',
      handleColor : '#333333',
      
      // sky
      sky1 : false,
      sky2 : false,
      sky3 : false,
      
      // crossbell
      zero : false,
      ao : false,
      
      // sen
      sen1 : false,
      sen2 : false,
      sen3 : false,
      sen4 : false,
      haji : false,
      
      // kuro
      kuro1 : false,
      kuro2 : false,
      kai1 : false,
      
      // other
      nayuta : false,
      ysvskiseki : false,
      otherGames : '',
      otherGamesColor : '#333333',
      
      // favorites
      favgame : '',
      favgameColor : '#333333',
      favchar : '',
      favcharColor : '#333333',
      favpair : '',
      favpairColor : '#333333',
      
      // about me
      about : '',
      aboutColor : '#333333',
      
      // display settings
      prevMode : 'full'
    },
    
    // cached data
    cache : {},
    
    
    // updates the kiseki profile with new data
    updateProfile : function (caller, type) {
      switch (type) {
        case 'lang' :
          // update main language class for switching texts
          document.body.className = document.body.className.replace(/(?:en|ja)-lang/, caller.value + '-lang');
          
          // update avatar select texts
          var ava = document.getElementById('info-avatar'),
              selected = ava.value;
              if (!AeonSystem.cache.opts_avatar) AeonSystem.cache.opts_avatar = document.getElementById('info-avatar').innerHTML;
          
          if (caller.value == 'en') {
            ava.innerHTML = AeonSystem.cache.opts_avatar;
            ava.value = selected;
            
          } else {
            ava.innerHTML = '<option value="custom">カスタム</option><optgroup label="空の軌跡"><option value="agate">アガット</option><option value="anelace">アネラス</option><option value="bleublanc">ブルブラン</option><option value="campanella">カンパネルラ</option><option value="cassius">カシウス</option><option value="gilbert">ギルバート</option><option value="estelle" selected>エステル</option><option value="josette">ジョゼット</option><option value="joshua">ヨシュア</option><option value="julia">ユリア</option><option value="kevin">ケビン</option><option value="kloe">クローゼ</option><option value="loewe">レーヴェ</option><option value="luciola">ルシオラ</option><option value="mueller">ミュラー</option><option value="not-mueller">ミュラーじゃない</option><option value="olivier">オリビエ</option><option value="renne">レン</option><option value="richard">リシャール</option><option value="ries">リース</option><option value="scherazard">シェラザード</option><option value="tita">ティータ</option><option value="walter">ヴァルター</option><option value="weissmann">ワイスマン</option><option value="zin">ジン</option></optgroup><optgroup label="クロスベル"><option value="arianrhod">アリアンロード</option><option value="arios">アリオス</option><option value="cao">ツァオ</option><option value="dieter">ディーター</option><option value="dudley">ダドリー</option><option value="elie">エリィ</option><option value="fran">フラン</option><option value="garcia">ガルシア</option><option value="guy">ガイ</option><option value="ian">イアン</option><option value="ilya">イリア</option><option value="jingo">ジンゴ</option><option value="joachim">ヨアヒム</option><option value="jona">ヨナ</option><option value="kea">キーア</option><option value="lloyd">ロイド</option><option value="mariabell">マリアベル</option><option value="mishy">みっしぃ</option><option value="noel">ノエル</option><option value="randy">ランディ</option><option value="dandy-randy">ダンディなランディ</option><option value="rixia">リーシャ</option><option value="sergei">セルゲイ</option><option value="sigmund">シグムント</option><option value="shirley">シャーリィ</option><option value="sully">シュリ</option><option value="tio">ティオ</option><option value="mishettio">みーしぇティオ</option><option value="wald">ヴァルド</option><option value="wazy">ワジ</option><option value="zeit">ツァイト</option></optgroup><optgroup label="閃の軌跡"><option value="alfin">アルフィン</option><option value="alisa">アリサ</option><option value="alisa-magical">まじかる☆アリサ</option><option value="angelica">アンゼリカ</option><option value="ash">アッシュ</option><option value="aurelia">オーレリア</option><option value="altina">アルティナ</option><option value="black-rabbit">ブラックラビット</option><option value="beryl">ベリル</option><option value="c">C</option><option value="celine">セリーヌ</option><option value="celine-human">セリーヌ（人間）</option><option value="claire">クレア</option><option value="crow">クロウ</option><option value="duvalie">デュバリィ</option><option value="elise">エリゼ</option><option value="elliot">エリオット</option><option value="emma">エマ</option><option value="ennea">エンネア</option><option value="fie">フィー</option><option value="gaius">ガイウス</option><option value="george">ジョルジュ</option><option value="ines">アイネス</option><option value="juna">ユウナ</option><option value="jusis">ユーシス</option><option value="kurt">クルト</option><option value="lapis">ラピス</option><option value="laura">ラウラ</option><option value="lechter">レクター</option><option value="machias">マキアス</option><option value="mcburn">マクバーン</option><option value="millium">ミリアム</option><option value="musse">ミュゼ</option><option value="nadia">ナーディア</option><option value="osborne">オズボーン</option><option value="rean">リィン</option><option value="rean-ogre">リィン（鬼）</option><option value="roselia">ローゼリア</option><option value="rufus">ルーファス</option><option value="rutger">ルトガー</option><option value="sara">サラ</option><option value="sharon">シャロン</option><option value="swin">スウィン</option><option value="toval">トヴァル</option><option value="towa">トワ</option><option value="victor">ヴィクター</option><option value="vita">ヴィータ</option></optgroup><optgroup label="黎の軌跡"><option value="aaron">アーロン</option><option value="agnès">アニエス</option><option value="bergard">ベルガルド</option><option value="celis">セリス</option><option value="dingo">ディンゴ</option><option value="elaine">エレイン</option><option value="ellroy">エルロイ</option><option value="emilia">エミリア</option><option value="feri">フェリ</option><option value="gerard">ジェラール</option><option value="hermès">エルメス</option><option value="ixs">イクス</option><option value="jorda">ヨルダ</option><option value="judith">ジュディス</option><option value="grimcat">ジュディ――怪盗グリムキャッツ</option><option value="kasim">カシム</option><option value="kurogane">クロガネ</option><option value="leon">リオン</option><option value="lucrezia">ルクレツィア</option><option value="mare">メア</option><option value="marielle">マリエル</option><option value="melchior">メルキオル</option><option value="nina">ニナ</option><option value="paulette">ポーレット</option><option value="quatre">カトル</option><option value="rené">ルネ</option><option value="risette">リゼット</option><option value="rocksmith">ロックスミス</option><option value="roy">ロイ</option><option value="shizuna">シズナ</option><option value="simeon">シメオン</option><option value="ulrica">ウルリカ</option><option value="van">ヴァン</option><option value="yumé">ユメ</option><option value="yun">ユン</option></optgroup><optgroup label="那由多の軌跡"><option value="creha">クレハ</option><option value="cygna">シグナ</option><option value="lyra">ライラ</option><option value="nayuta">ナユタ</option><option value="noi">ノイ</option></optgroup>';
            ava.value = selected;
          }
          
          // update background select texts
          var bg = document.getElementById('info-background'),
              selected = bg.value;
              if (!AeonSystem.cache.opts_bg) AeonSystem.cache.opts_bg = document.getElementById('info-background').innerHTML;
          
          if (caller.value == 'en') {
            bg.innerHTML = AeonSystem.cache.opts_bg;
            bg.value = selected;
            
          } else {
            bg.innerHTML = '<option value="sora" default>空の軌跡</option><option value="sora2" default>空の軌跡2</option><option value="crossbell">クロスベル</option><option value="crossbell2">クロスベル2</option><option value="sen">閃の軌跡</option><option value="sen2">閃の軌跡2</option><option value="kuro">黎の軌跡</option><option value="kuro2">黎の軌跡2</option><option value="nayuta">那由多の軌跡</option><option value="nayuta2">那由多の軌跡2</option>';
            bg.value = selected;
          }
          
          // update gender select options
          var gender = document.getElementById('info-gender'),
              selected = gender.value;
              if (!AeonSystem.cache.opts_gender) AeonSystem.cache.opts_gender = document.getElementById('info-gender').innerHTML;
          
          if (caller.value == 'en') {
            gender.innerHTML = AeonSystem.cache.opts_gender;
            gender.value = selected;
            
          } else {
            gender.innerHTML = '<option value="null" default>無し</option><option value="male">男</option><option value="female">女</option><option value="other">他</option>';
            gender.value = selected;
          }
          
          // update preview mode select options
          var prevMode = document.getElementById('info-prevMode'),
              selected = prevMode.value;
              if (!AeonSystem.cache.opts_prevMode) AeonSystem.cache.opts_prevMode = document.getElementById('info-prevMode').innerHTML;
          
          if (caller.value == 'en') {
            prevMode.innerHTML = AeonSystem.cache.opts_prevMode;
            prevMode.value = selected;
            
          } else {
            prevMode.innerHTML = '<option value="full" default>丸見え</option><option value="zoom">ズーム</option>';
            prevMode.value = selected;
          }
          
          // update object settings
          AeonSystem.profile.lang = caller.value;
          break;
          
        // changes preview mode
        case 'prevMode' :
          var preview = document.getElementById('preview-box');
          if (preview) {
            preview.className = 'prev-' + caller.value;
            AeonSystem.profile.prevMode = caller.value;
          }
          break;
          
        // changes avatar
        case 'avatar' :
          // set avatar
          var ava = document.getElementById('kp-avatar'),
              prev = document.getElementById('avatar-prev'),
              img = 'url(' + (caller.value == 'custom' ? AeonSystem.profile.avatarCustom : 'aeon-system/avatar/' + caller.value + '.jpg') + ')';
          
          ava.style.backgroundImage = img; 
          AeonSystem.profile.avatar = caller.value;
          
          // shows background preview
          if (prev) {
            prev.style.backgroundImage = img;
          }
          break;
          
        case 'avatarCustom' :
          // save avatar to aeon system
          AeonSystem.profile.avatarCustom = URL.createObjectURL(caller.files[0]);
          
          // set avatar to "custom" and apply the custom avatar
          field = document.getElementById('info-avatar');
          field.value = 'custom';
          field.dispatchEvent(new Event('change'));
          
          // let user know upload was successful
          AeonSystem.avatarOK();

          // clears input so file can be loaded again
          document.getElementById('info-avatarCustom').value = '';
          break;
          
        case 'background' :
          var tmp = document.getElementById('template'), prev = document.getElementById('bg-prev');
          tmp.className = tmp.className.replace(/(?:sora|sora2|crossbell|crossbell2|sen|sen2|kuro|kuro2|nayuta|nayuta2)-bg/, caller.value + '-bg');
          AeonSystem.profile.background = caller.value;
          
          // shows background preview
          if (prev) {
            prev.style.backgroundImage = 'url(aeon-system/template/' + caller.value + '.jpg)';
          }
          break;
          
        case 'gender' :
          var tmp = document.getElementById('template');
          tmp.className = tmp.className.replace(/(?:null|male|female|other)-gender/, caller.value + '-gender');
          AeonSystem.profile.gender = caller.value;
          break;
          
        case 'text' :
          var id = caller.id.replace('info-', '');
          document.getElementById('kp-' + id).innerText = caller.value;
          AeonSystem.profile[id] = caller.value;
          break;
          
        case 'fontColor' :
          var id = caller.id.replace('info-', '');
          document.getElementById('kp-' + id.replace('Color', '')).style.color = caller.value;
          AeonSystem.profile[id] = caller.value;
          break;
          
        case 'checkbox' :
          var id = caller.id.replace('info-', ''),
              field = document.getElementById('kp-' + id);
          
          if (caller.checked) {
            field.className += ' played';
            
          } else {
            field.className = field.className.replace(' played', '');
          }
          
          AeonSystem.profile[id] = caller.checked;
          break;
          
        default:
          break;
      }
      
      // save profile to localStorage so progress is not lost
      AeonSystem.saveProfile();
    },
    
    
    // saves profile to localStorage so it can be restored
    saveProfile : function () {
      if (storageOK) {
        localStorage.kisekiProfile = JSON.stringify(AeonSystem.profile);
      }
    },
    
    
    // restores the profile saved in localStorage
    restoreProfile : function (uploaded) {
      if ((storageOK && localStorage.kisekiProfile) || uploaded) {
        if (!uploaded) AeonSystem.profile = JSON.parse(localStorage.kisekiProfile);
        
        for (var i in AeonSystem.profile) {
          var field = document.getElementById('info-' + i);
          
          if (!/avatarCustom/.test(i)) { // exclusions
            if (field) {
              // handles checkbox values
              if (field.tagName == 'INPUT' && field.type == 'checkbox') {
                var node = document.getElementById('kp-' + i);
                if (node) node.className = node.className.replace(' played', ''); // remove "played" class to prevent duplication

                field.checked = AeonSystem.profile[i];
                field.dispatchEvent(new Event('change'));

              } else {
                field.value = AeonSystem.profile[i];
                // lazily trigger bound events to update the template automatically so we don't have to do it here
                field.dispatchEvent(new Event(field.tagName == 'SELECT' ? 'change' : 'input'));
              }

            } else {
              console.error(field, i, AeonSystem.profile[i]);
            }
          }
        }
      }
    },
    
    
    // clears all fields
    resetProfile : function () {
      if (confirm(AeonSystem.profile.lang == 'en' ? 'All fields will be reset. Do you want to continue?' : 'すべての情報をリセットします。よろしいですか？')) {
        for (var i in AeonSystem.profile) {
          var field = document.getElementById('info-' + i);
          if (field.type == 'checkbox') {
            field.checked = false;
            
          } else if (i != 'lang') {
            field.value = 
              i == 'avatar' ? 'estelle' :
              i == 'background' ? 'sora' :
              i == 'gender' ? 'null' :
              i == 'prevMode' ? 'full' :
              /Color/.test(i) ? '#333333' : '';
          }
          
          // lazily update profile object + storage
          field.dispatchEvent(new Event((field.tagName == 'SELECT' || field.type == 'checkbox') ? 'change' : 'input'));
        }
        
        // remove avatar
        var ava = document.getElementById('kp-avatar');
        ava.style.backgroundImage = '';
      }
    },
    
    
    // generates the kiseki profile image using html2canvas
    // (does not work locally unless browser is running with cors disabled. Chrome flag for that: --disable-web-security --user-data-dir=c:\my\data)
    generateProfile : function () {
      // restore preview to normal size, otherwise the image won't be generated properly
      var preview = document.getElementById('preview-box'), full = false;
      if (preview && /prev-full/.test(preview.className)) {
        preview.className = '';
        full = true;
      }
      
      // generate profile
      html2canvas(document.getElementById('template')).then(function(canvas) {
        var link = document.createElement('A');
        link.href = canvas.toDataURL();
        link.download = 'kiseki-profile.png';
        link.click();
      });
      
      // restore user preview preference
      if (full) {
        preview.className = 'prev-full';
      }
    },
    
    
    // saves the profile locally to a JSON file, so the user can backup their profile in case they want to edit it later
    downloadProfile : function () {
      var link = document.createElement('A');
      link.href = 'data:,' + encodeURIComponent(JSON.stringify(AeonSystem.profile, '', '  ').replace(/\n/g, '\r\n'));
      link.download = 'kiseki-profile.json';
      link.click();
    },
    
    
    // uploads a locally saved profile
    uploadProfile : function (input, dropped) {
      var file = dropped ? input : input.files[0],
          reader = new FileReader();
      
      reader.onload = function (e) {
        AeonSystem.profile = JSON.parse(e.target.result);
        AeonSystem.restoreProfile(true);
        
        // clears input so file can be loaded again
        document.getElementById('fileLoader').value = '';
      };
      
      reader.readAsText(file, 'UTF-8');
    },
    
    
    // handle uploading kiseki profile files that are dropped on inputs
    dropFile : function (e) {
      AeonSystem.uploadProfile(e.dataTransfer.files[0], true);
      e.preventDefault();
    },
    
    
    // prompt to let the user know their avatar was uploaded successfully
    avatarOK : function () {
      if (AeonSystem.avatarPrompt) {
        clearTimeout(AeonSystem.avatarPrompt);
      }
      
      // show prompt
      document.getElementById('uploadOK').style.display = '';
      
      // hide prompt after a few seconds
      AeonSystem.avatarPrompt = setTimeout(function() {
        document.getElementById('uploadOK').style.display = 'none';
        delete AeonSystem.avatarPrompt;
      }, 3000);
    },
    
    
    // locates and returns our current page path
    getPaths : function () {
      var path = window.location.pathname;

      if (/\/contact\//.test(path)) {
        return '../';

      } else {
        return '';
      }
    },
    
    
    /* EASTER EGGS BELOW */
    
    // Tio releases all restrictions set by the Aeon System
    limitBreak : function (Tio) {
      if (!AeonSystem.activated) { // only activate the aeon system once per page instance
        var path = AeonSystem.getPaths();
        AeonSystem.activated = true;
        AeonSystem.animating = true;
        AeonSystem.intro = document.getElementById('intro-bubble');
        AeonSystem.introText = AeonSystem.intro.innerHTML;
        document.body.className += ' aeon-system-active';
        
        // adjust button positions to prevent overlapping
        var btn = document.getElementById('button-options');
        if (btn) btn.style.paddingRight = '300px';
        
        // load the audio into the Aeon System for playing
        AeonSystem.audio = {
          kidou : document.getElementById('aeon-system-kidou'),
          limitBreak : document.getElementById('aeon-system-limit-break'),
          mysticCore : document.getElementById('mystic-core')
        };
        
        // change Tio's sprite
        Tio.src = path + 'aeon-system/images/tio-staff.png';
        
        // prepare youselves for greatness... Tio.. TALKS.
        AeonSystem.audio.kidou.play();
        AeonSystem.intro.innerHTML = '<span class="aeon-system-dialogue"><span class="en">Aeon system, activate.</span><span class="ja">エイオンシステム、起動。</span></span>';
        
        // begin playing mystic core, one of the greatest tracks in Azure, made even greater by Tio's epic scene on top of Orchis tower
        setTimeout(function() { // 1; 1000
          AeonSystem.audio.mysticCore.play();
          
          // change Tio's sprite to reflect activation of the Aeon System
          setTimeout(function() { // 2; 500
            Tio.src = path + 'aeon-system/images/tio-aeon-system.png';
            
            // Tio finally releases all limiters on the Aeon System, for an epic display
            setTimeout(function() { // 3; 3000
              AeonSystem.audio.limitBreak.play();
              AeonSystem.intro.innerHTML = '<span class="aeon-system-dialogue"><span class="en">Aeon system, limit break!</span><span class="ja">エイオンシステム、<ruby>制限解除<rt>リミットブレイク</rt></ruby>！</span></span>';
              
              // light up Tio's cat ear sensors further
              setTimeout(function() { // 4; 2200
                Tio.parentNode.className = 'tio-limit-break';
                AeonSystem.animating = false;
                
                setTimeout(function() { // 5; 1000
                  AeonSystem.intro.innerHTML = '<span class="aeon-system-dialogue"><span class="en">You can stop the music at any time by clicking me...</span><span class="ja">音楽を止めたかったら、私をクリックしてください……</span></span>';
                  
                  setTimeout(function() { // 6; 6000
                    AeonSystem.intro.innerHTML = AeonSystem.introText;
                  }, 6000);
                }, 1000);
              }, 2200);
            }, 3000);
          }, 500);
        }, 1000);
      }
      
      // if the Aeon System is already active, toggle mystic core playback/Tio's sensor's glow
      else if (!AeonSystem.animating) {
        var path = AeonSystem.getPaths();
        
        if (AeonSystem.audio.mysticCore.paused) {
          AeonSystem.audio.mysticCore.play();
          Tio.parentNode.className = 'tio-limit-break';
          Tio.src = path + 'aeon-system/images/tio-aeon-system.png';
        } else {
          AeonSystem.audio.mysticCore.pause();
          Tio.parentNode.className = '';
          Tio.src = path + 'aeon-system/images/tio-staff.png';
        }
      }
    },
    
    
    // reward Tio by giving her a Mishy
    giveMishy : function (caller) {
      var tio = document.getElementById('tio-plato'),
          mishy = document.getElementById('mishy');
      
      // load audio into the Aeon System for playing
      AeonSystem.audio2 = {
        ahMishy : document.getElementById('tio-ah-mishy'),
        mishy : document.getElementById('tio-mishy'),
        arigatou : document.getElementById('tio-arigatou')
      };
      
      // show Tio Mishy!
      caller.style.visibility = 'hidden';
      caller.onclick = null;
      mishy.style.visibility = '';
      
      // Tio gets up in disbelief
      setTimeout(function () {
        tio.src = 'aeon-system/images/tio-plato.png';
        AeonSystem.audio2.ahMishy.play();
        
        // TO HER SURPRISE IT'S MISHY!!!
        setTimeout(function () {
          tio.src = 'aeon-system/images/tio-plato-excited.png';
          
          // she excitedly chases mishy down to give him a nice big hug
          setTimeout(function () {
            mishy.src = 'aeon-system/images/mishy-run.png';
            mishy.className = 'runLeft';
            tio.className = 'runLeft';
            
            // Tio relentlessly chases mishy down!!
            setTimeout(function () {
              mishy.className = 'runRight';
              tio.className = 'runRight';
              
              // At long last Tio nabs Mishy!!!!
              setTimeout(function () {
                mishy.className = 'runBack';
                tio.className = 'runBack';

                // Now she can happily hug her beloved Mishy... (*sniff* I'm so happy for you Tio..)
                setTimeout(function () {
                  mishy.style.display = 'none';
                  tio.className = '';
                  tio.src = 'aeon-system/images/tio-and-mishy.png';
                  AeonSystem.audio2.mishy.play();
                  
                  // Tio thanks us for the Mishy (YOU'RE WELCOME, TIOSUKE!!!)
                  setTimeout(function () {
                    tio.src = 'aeon-system/images/tio-and-mishy-excited.png';
                    AeonSystem.audio2.arigatou.play();
                  }, 1500);
                }, 3000);
              }, 3000);
            }, 3000);
          }, 1000);
        }, 1000);
      }, 500);
    }
    
  };
  
}(window, document));