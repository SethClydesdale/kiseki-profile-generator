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
      
      gender : 'null',
      
      // display name
      name : '',
      nameColor : '#000',
      
      // twitter id
      handle : '',
      handleColor : '#000',
      
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
      
      // other
      nayuta : false,
      ysvskiseki : false,
      otherGames : '',
      otherGamesColor : '#000',
      
      // favorites
      favgame : '',
      favgameColor : '#000',
      favchar : '',
      favcharColor : '#000',
      favpair : '',
      favpairColor : '#000',
      
      // about me
      about : '',
      aboutColor : '#000'
    },
    
    
    // updates the kiseki profile with new data
    updateProfile : function (caller, type) {
      switch (type) {
        case 'lang' :
          var tmp = document.getElementById('template');
          tmp.className = tmp.className.replace(/(?:en|ja)-lang/, caller.value + '-lang');
          AeonSystem.profile.lang = caller.value;
          break;
          
        // note: avatar data is not saved
        case 'avatar' :
          // set avatar
          document.getElementById('kp-avatar').src = URL.createObjectURL(caller.files[0]);

          // clears input so file can be loaded again
          document.getElementById('info-avatar').value = '';
          break;
          
        case 'background' :
          var tmp = document.getElementById('template');
          tmp.className = tmp.className.replace(/(?:sora|crossbell|sen|kuro)-bg/, caller.value + '-bg');
          AeonSystem.profile.background = caller.value;
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
      
      // save profile to localStorage so progress is no lost
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
          
          if (field) {
            // handles checkbox values
            if (field.tagName == 'INPUT' && field.type == 'checkbox' && AeonSystem.profile[i] == true) {
              field.click();
              
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
    },
    
    
    // generates the kiseki profile image using html2canvas
    // (does not work locally unless browser is running with cors disabled. Chrome flag for that: --disable-web-security --user-data-dir=c:\my\data)
    generateProfile : function () {
      html2canvas(document.getElementById('template')).then(function(canvas) {
        var link = document.createElement('A');
        link.href = canvas.toDataURL();
        link.download = 'kiseki-profile.png';
        link.click();
      });
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
        AeonSystem.intro.innerHTML = '<span class="aeon-system-dialogue">Aeon system, activate.</span>';
        
        // begin playing mystic core, one of the greatest tracks in Azure, made even greater by Tio's epic scene on top of Orchis tower
        setTimeout(function() { // 1; 1000
          AeonSystem.audio.mysticCore.play();
          
          // change Tio's sprite to reflect activation of the Aeon System
          setTimeout(function() { // 2; 500
            Tio.src = path + 'aeon-system/images/tio-aeon-system.png';
            
            // Tio finally releases all limiters on the Aeon System, for an epic display
            setTimeout(function() { // 3; 3000
              AeonSystem.audio.limitBreak.play();
              AeonSystem.intro.innerHTML = '<span class="aeon-system-dialogue">Aeon system, limit break!</span>';
              
              // light up Tio's cat ear sensors further
              setTimeout(function() { // 4; 2200
                Tio.parentNode.className = 'tio-limit-break';
                AeonSystem.animating = false;
                
                setTimeout(function() { // 5; 1000
                  AeonSystem.intro.innerHTML = '<span class="aeon-system-dialogue">You can stop the music at any time by *sigh* clicking me..</span>';
                  
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