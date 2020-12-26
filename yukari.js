var yukari = document.getElementById("yukari");
        
            window.onscroll = function() {scrollFunction()};
            
            function scrollFunction() {
              if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                yukari.style.display = "block";
              } else {
                yukari.style.display = "none";
              }
            }
            function yukarigit() {
              document.body.scrollTop = 0;
              document.documentElement.scrollTop = 0;
            }