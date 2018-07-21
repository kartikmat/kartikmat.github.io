function contains(key,caption)
{
    var n = caption.search(key);
    if (n==-1) {
        console.log("Is not in the captions");
        
        return false;
    }
    console.log("In the captions");
    return true;
}

function parseXML(xml){
    console.log("Parsing");
    var caption="";
    for (let index = 0; index < xml.childNodes[0].childNodes.length; index++) {
        
        console.log(xml.childNodes[0].childNodes[index].innerHTML);
        caption+=xml.childNodes[0].childNodes[index].innerHTML;
        
       
    }
  return caption;
}
function makeRequest(videoId)
{
    
    $.ajax({
            type: "POST",
            url: "https://video.google.com/timedtext?lang=en&v=5MgBikgcWnY"
          }).done(function (response) {
            console.dir(response);
            if(contains(keyword,parseXML(response)))
            {
              return true;
            }
              return false;
          }).fail(function (response) {
            console.log();
          });
}
if(makeRequest("foo"))
        {
             console.log("Success");
        }