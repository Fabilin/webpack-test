import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import {renderChat} from 'tock-react-kit'
import $ from 'jquery'

const chat = document.createElement('div')
chat.innerHTML = `
<div id="chat-circle" class="btn btn-raised">
        <div id="chat-overlay"></div>
        <img src="https://doc.tock.ai/fr/images/botchat.png"/>
    </div>

    <div class="chat-box">
        <div class="chat-box-header">
            Parlons un peu de Tock...
            <span class="chat-box-toggle"><span class="fas fa-window-close"></span></span>
        </div>
        <div class="chat-box-body">
            <div class="chat-box-overlay">
            </div>

            <div class="chat-logs">
                <div id="chat"></div>
                <div class="welcome">Bonjour je suis Toki. Je serai bientôt incollable sur Tock 😉<br>Une question ? Comment puis-je vous aider ?</div>
            </div>
        </div>
    </div>`
document.body.appendChild(chat);
const style = document.createElement('style');
style.innerHTML = `
        #chat-circle {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 30;
            position: fixed;
            bottom: 50px;
            right: 50px;
            background: #efefef;
            text-align: center;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            color: white;
            padding: 28px;
            cursor: pointer;
            box-shadow: 0px 3px 16px 0px rgba(0, 0, 0, 0.6), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
        }

        .btn#my-btn {
            background: white;
            padding-top: 13px;
            padding-bottom: 12px;
            border-radius: 45px;
            padding-right: 40px;
            padding-left: 40px;
            color: #5865C3;
        }

        #chat-overlay {
            background: rgba(255, 255, 255, 0.1);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            display: none;
        }

        .chat-box {
            z-index: 30;
            display: none;
            background: #efefef;
            position: fixed;
            right: 30px;
            bottom: 50px;
            width: 33vw;
            max-width: 85vw;
            max-height: 80vh;
            border-radius: 20px;
            /*   box-shadow: 0px 5px 35px 9px #464a92; */
            box-shadow: 20px 20px 5px 1px rgba(0, 0, 0, 0.5);
        }

        .chat-box-toggle {
            float: right;
            margin-right: 15px;
            cursor: pointer;
        }

        .chat-box-header {
            background: #fcaa3e;
            height: 70px;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            color: white;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            padding-top: 17px;
        }

        .chat-box-body {
            position: relative;
            height: 370px;
            height: auto;
            /*border:1px solid #ccc;*/
            overflow: hidden;
        }

        .chat-box-body:after {
            content: "";
            background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAgOCkiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGNpcmNsZSBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS4yNSIgY3g9IjE3NiIgY3k9IjEyIiByPSI0Ii8+PHBhdGggZD0iTTIwLjUuNWwyMyAxMW0tMjkgODRsLTMuNzkgMTAuMzc3TTI3LjAzNyAxMzEuNGw1Ljg5OCAyLjIwMy0zLjQ2IDUuOTQ3IDYuMDcyIDIuMzkyLTMuOTMzIDUuNzU4bTEyOC43MzMgMzUuMzdsLjY5My05LjMxNiAxMC4yOTIuMDUyLjQxNi05LjIyMiA5LjI3NC4zMzJNLjUgNDguNXM2LjEzMSA2LjQxMyA2Ljg0NyAxNC44MDVjLjcxNSA4LjM5My0yLjUyIDE0LjgwNi0yLjUyIDE0LjgwNk0xMjQuNTU1IDkwcy03LjQ0NCAwLTEzLjY3IDYuMTkyYy02LjIyNyA2LjE5Mi00LjgzOCAxMi4wMTItNC44MzggMTIuMDEybTIuMjQgNjguNjI2cy00LjAyNi05LjAyNS0xOC4xNDUtOS4wMjUtMTguMTQ1IDUuNy0xOC4xNDUgNS43IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS4yNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTg1LjcxNiAzNi4xNDZsNS4yNDMtOS41MjFoMTEuMDkzbDUuNDE2IDkuNTIxLTUuNDEgOS4xODVIOTAuOTUzbC01LjIzNy05LjE4NXptNjMuOTA5IDE1LjQ3OWgxMC43NXYxMC43NWgtMTAuNzV6IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS4yNSIvPjxjaXJjbGUgZmlsbD0iIzAwMCIgY3g9IjcxLjUiIGN5PSI3LjUiIHI9IjEuNSIvPjxjaXJjbGUgZmlsbD0iIzAwMCIgY3g9IjE3MC41IiBjeT0iOTUuNSIgcj0iMS41Ii8+PGNpcmNsZSBmaWxsPSIjMDAwIiBjeD0iODEuNSIgY3k9IjEzNC41IiByPSIxLjUiLz48Y2lyY2xlIGZpbGw9IiMwMDAiIGN4PSIxMy41IiBjeT0iMjMuNSIgcj0iMS41Ii8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTkzIDcxaDN2M2gtM3ptMzMgODRoM3YzaC0zem0tODUgMThoM3YzaC0zeiIvPjxwYXRoIGQ9Ik0zOS4zODQgNTEuMTIybDUuNzU4LTQuNDU0IDYuNDUzIDQuMjA1LTIuMjk0IDcuMzYzaC03Ljc5bC0yLjEyNy03LjExNHpNMTMwLjE5NSA0LjAzbDEzLjgzIDUuMDYyLTEwLjA5IDcuMDQ4LTMuNzQtMTIuMTF6bS04MyA5NWwxNC44MyA1LjQyOS0xMC44MiA3LjU1Ny00LjAxLTEyLjk4N3pNNS4yMTMgMTYxLjQ5NWwxMS4zMjggMjAuODk3TDIuMjY1IDE4MGwyLjk0OC0xOC41MDV6IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS4yNSIvPjxwYXRoIGQ9Ik0xNDkuMDUgMTI3LjQ2OHMtLjUxIDIuMTgzLjk5NSAzLjM2NmMxLjU2IDEuMjI2IDguNjQyLTEuODk1IDMuOTY3LTcuNzg1LTIuMzY3LTIuNDc3LTYuNS0zLjIyNi05LjMzIDAtNS4yMDggNS45MzYgMCAxNy41MSAxMS42MSAxMy43MyAxMi40NTgtNi4yNTcgNS42MzMtMjEuNjU2LTUuMDczLTIyLjY1NC02LjYwMi0uNjA2LTE0LjA0MyAxLjc1Ni0xNi4xNTcgMTAuMjY4LTEuNzE4IDYuOTIgMS41ODQgMTcuMzg3IDEyLjQ1IDIwLjQ3NiAxMC44NjYgMy4wOSAxOS4zMzEtNC4zMSAxOS4zMzEtNC4zMSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEuMjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvZz48L3N2Zz4=');
            opacity: 0.1;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            height: 100%;
            position: absolute;
            z-index: -1;
        }

        #chat-input {
            background: #f4f7f9;
            width: 100%;
            position: relative;
            height: 47px;
            padding-top: 10px;
            padding-right: 50px;
            padding-bottom: 10px;
            padding-left: 15px;
            border: none;
            resize: none;
            outline: none;
            border: 1px solid #ccc;
            color: #888;
            border-top: none;
            border-bottom-right-radius: 5px;
            border-bottom-left-radius: 5px;
            overflow: hidden;
        }

        .chat-input > form {
            margin-bottom: 0;
        }

        #chat-input::-webkit-input-placeholder { /* Chrome/Opera/Safari */
            color: #ccc;
        }

        #chat-input::-moz-placeholder { /* Firefox 19+ */
            color: #ccc;
        }

        #chat-input:-ms-input-placeholder { /* IE 10+ */
            color: #ccc;
        }

        #chat-input:-moz-placeholder { /* Firefox 18- */
            color: #ccc;
        }

        .chat-submit {
            position: absolute;
            bottom: 3px;
            right: 10px;
            background: transparent;
            box-shadow: none;
            border: none;
            border-radius: 50%;
            color: #5A5EB9;
            width: 35px;
            height: 35px;
        }

        .chat-logs {
            padding: 15px;
            max-height: 50vh;
            overflow-y: scroll;
            display: flex;
            flex-direction: column-reverse;
        }

        .chat-logs::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            background-color: #F5F5F5;
        }

        .chat-logs::-webkit-scrollbar {
            width: 5px;
            background-color: #F5F5F5;
        }

        .chat-logs::-webkit-scrollbar-thumb {
            background-color: #5A5EB9;
        }


        @media only screen and (max-width: 500px) {
            .chat-logs {
                height: 40vh;
            }
        }`
document.body.appendChild(style);
renderChat(document.getElementById('chat'), 'https://demo-bot.tock.ai/io/tock/tockbot/web', '', {
    palette: {
        text: {
            card: 'rgba(252,170,62,0.8	)',
            bot: 'black',
        },
        background: {
            card: 'white',
            bot: 'rgba(252,170,62,0.34)',
        },
    },
    sizing: {
        loaderSize: '8px',
        borderRadius: '8px',
        conversation: {
            //	width: '720px',
        },
    },
    typography: {
        fontFamily: '\'Source Sans Pro\', sans-serif',
        //fontSize: '24px',
    },
    overrides: {
        //chat: `background: #fff;`,
        card: {
            cardContainer: 'width: 27vw;',
            // cardButton: 'background: white',
        },
        chatInput: {
            // container: 'padding: 0;',
            // input: 'color: red;',
            icon: 'width: 3vw; height: 3vh;',
            // icon: 'width: 10vw; height: 10vh; background: url(\'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Eo_circle_yellow_arrow-right.svg/240px-Eo_circle_yellow_arrow-right.svg.png\') no-repeat left top; background-size: 50%;',
        },
    },
});
$(function () {
    var INDEX = 0;
    $("#chat-submit").click(function (e) {
        e.preventDefault();
        var msg = $("#chat-input").val();
        if (msg.trim() == '') {
            return false;
        }
        generate_message(msg, 'self');
        var buttons = [
            {
                name: 'Existing User',
                value: 'existing'
            },
            {
                name: 'New User',
                value: 'new'
            }
        ];
        setTimeout(function () {
            generate_message(msg, 'user');
        }, 1000)

    })

    function generate_message(msg, type) {
        INDEX++;
        var str = "";
        str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";
        str += "          <span class=\"msg-avatar\">";
        str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
        str += "          <\/span>";
        str += "          <div class=\"cm-msg-text\">";
        str += msg;
        str += "          <\/div>";
        str += "        <\/div>";
        $(".chat-logs").append(str);
        $("#cm-msg-" + INDEX).hide().fadeIn(300);
        if (type == 'self') {
            $("#chat-input").val('');
        }
        $(".chat-logs").stop().animate({scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);
    }

    function generate_button_message(msg, buttons) {
        /* Buttons should be object array
          [
            {
              name: 'Existing User',
              value: 'existing'
            },
            {
              name: 'New User',
              value: 'new'
            }
          ]
        */
        INDEX++;
        var btn_obj = buttons.map(function (button) {
            return "              <li class=\"button\"><a href=\"javascript:;\" class=\"btn btn-primary chat-btn\" chat-value=\"" + button.value + "\">" + button.name + "<\/a><\/li>";
        }).join('');
        var str = "";
        str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg user\">";
        str += "          <span class=\"msg-avatar\">";
        str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
        str += "          <\/span>";
        str += "          <div class=\"cm-msg-text\">";
        str += msg;
        str += "          <\/div>";
        str += "          <div class=\"cm-msg-button\">";
        str += "            <ul>";
        str += btn_obj;
        str += "            <\/ul>";
        str += "          <\/div>";
        str += "        <\/div>";
        $(".chat-logs").append(str);
        $("#cm-msg-" + INDEX).hide().fadeIn(300);
        $(".chat-logs").stop().animate({scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);
        $("#chat-input").attr("disabled", true);
    }

    $(document).delegate(".chat-btn", "click", function () {
        var value = $(this).attr("chat-value");
        var name = $(this).html();
        $("#chat-input").attr("disabled", false);
        generate_message(name, 'self');
    })

    $("#chat-circle").click(function () {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    })

    $(".chat-box-toggle").click(function () {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    })

})
