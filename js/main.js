function onData(data) 
{
    var selected_date = $('#my_date_picker').datepicker('getDate');
    var julian_day = selected_date.getJulian() + 1;
    var timestamp = Math.round(selected_date.getTime()/1000) + 20 * 3600;
    var replaced_value = data.replace("##JULIAN_DAY##", julian_day);
    replaced_value = replaced_value.replace(/##TIMESTAMP##/g, timestamp);
    if($('#option1').prop('checked')) {
        //no disruption, remove disruption
        //console.log(replaced_value);
        replaced_value = replaced_value.replace(/\r\n/g, "@NEWLINE@");
        //remove DisruptionHistory
        replaced_value = replaced_value.replace(/\"DisruptionHistory(.*?)IdentityElement/g, "\"IdentityElement");
        //remove Communication
        replaced_value = replaced_value.replace(/\,@NEWLINE@\s\s+\"Communications(.*?)\]/g, "");
        replaced_value = replaced_value.replace(/@NEWLINE@/g, "\n");
    } else {
        //remove extra newlines
        replaced_value = replaced_value.replace(/\r\n/g, "@NEWLINE@");
        replaced_value = replaced_value.replace(/@NEWLINE@/g, "\n");
    }

    //clear the previous text
    $( "#textToCopy" ).text('');
    $( "#textToCopy" ).append(replaced_value);
}

function parsingProfile(id) 
{ 
    switch(id) {
        case 1:
            $.get('raw/isabelle_dubois.json', function(data) { 
                onData(data);
            }, 'text');
            break;
        case 2:
            $.get('raw/bruce_wayne.json', function(data) { 
                onData(data);
            }, 'text');
            break;
        case 3:
            $.get('raw/kewei_hu.json', function(data) { 
                onData(data);
            }, 'text');
            break;
        default:
            $.get('raw/isabelle_dubois.json', function(data) { 
                onData(data);
            }, 'text');
    }
}

$(document).ready( function() {
    Date.prototype.getJulian = function() {
        return Math.floor((this / 86400000) - (this.getTimezoneOffset()/1440) + 2440587.5);
    }

    var selected_profile = 1;
    $( "#hidden_block").hide();
    $( "#hidden_info").hide();
    $('#my_date_picker').datepicker({
        autoclose: true,
        todayBtn: true,
        todayHighlight: true,
        orientation: "bottom" 
    });
    $("#my_date_picker").datepicker("setDate", new Date());
    $.get('raw/isabelle_dubois.json', function(data) {    
    }, 'text');
    //Dropdown plugin data
    var ddData = [
        {
            text: "Isabelle Dubois",
            value: 1,
            selected: true,
            description: "Perfume lover",
            imageSrc: "img/isabelle_dubois.png"
        },
        {
            text: "Bruce Wayne",
            value: 2,
            selected: false,
            description: "Extremely rich guy",
            imageSrc: "img/bruce_wayne.png"
        },
        {
            text: "Kewei Hu",
            value: 3,
            selected: false,
            description: "Pick me!",
            imageSrc: "img/kewei_hu.png"
        }
    ];

    $('#myDropdown').ddslick({
    data:ddData,
    width:260,
    selectText: "Select your profile to generate",
    imagePosition:"left",
    onSelected: function(selectedData){
        selected_profile = selectedData.selectedData.value;
    }   
    });
    $('#copy').tooltip({
            trigger: 'click',
            delay: { "show": 1500, "hide": 2000 }
    });
    $("body")
      .on("copy", ".zclip", function(e) {
        e.clipboardData.clearData();
        e.clipboardData.setData("text/plain", $( "#textToCopy" ).text());
        e.preventDefault();
        $('#copy').tooltip('show');
    });

    $( "#convert" ).click(function() {
        if($('#my_date_picker').datepicker('getDate') != undefined) {
            parsingProfile(selected_profile);
            $( "#hidden_info").hide();
            $( "#hidden_block").fadeOut();
            $( "#hidden_block").fadeIn();
        } else {
            $( "#hidden_info").show();
            $( "#hidden_block").hide();
        }
        
    });
});
