 $(document).ready(function() {
    var filters = ['paypal', 'creditcard', 'bitcoin', 'skrill'];
    var toggledFilters = ['paypal', 'creditcard', 'bitcoin', 'skrill'];
    var filterElements = $('.li-filter');

    var updateView = function() {
      //show more or that's all

      var hasSites = siteData.some(function(category) {
          return category.sites.length > 0;
      });
      if (hasSites) {
        $('.showmore.scroll').fadeIn();
        $('.showmore.loaded').fadeOut();
        $('a.page-scroll').fadeIn();
      } else {
        $('.showmore.scroll').fadeOut();
        $('.showmore.loaded').fadeIn();
        $('a.page-scroll').fadeOut();
      }

      //resetting view and then updating it depending on filters
      filterElements.removeClass('toggle');
      $('i.sk').removeClass('highlight');

      //showing everything if none toggled
      // if (toggledFilters == "none") {
      //   $('li.site').fadeIn();
      //   $('.category-wrap').fadeIn();
      //   return;
      // }

      //adding class to filter element and showing sites that are toggled
      filterElements.each(function (index, element) {
          if (toggledFilters.indexOf($(element).attr('data-method')) !== -1) {
            $(element).addClass('toggle');
          }
      });

      toggledFilters.forEach(function (toggledFilter) {
        $('li.site' + '.site-' + toggledFilter).fadeIn();
        $('li.site' + '.site-' + toggledFilter).closest('.category-wrap').fadeIn();
        $('li.site' + '.site-' + toggledFilter).find('i.icon-' + toggledFilter).addClass('highlight');
      });

      //hiding sites that are not toggled
      var diff = $(filters).not(toggledFilters).get();
      diff.forEach(function (toDisable) {
        $('li.site.site-' + toDisable).not('.site-' + toggledFilters.join(', .site-')).fadeOut(400, function() {
          if ($(this).parent().find('li:visible').length == 0) {
            $(this).closest('.category-wrap').fadeOut();
          }
        });
      });
    };

    filterElements.click(function() {
      var method = $(this).attr('data-method');
      var index = toggledFilters.indexOf(method);

      if (index == -1) {
        toggledFilters.push(method);
      } else {
        toggledFilters.splice(index, 1);
      }

      updateView();
    });

    //grid system
    var Shuffle = window.shuffle;
    var element = document.getElementById('categories');
    var sizer = document.getElementById('grid-sizer');
    var shuffle = new Shuffle(element, {
      itemSelector: '.category-column',
      sizer: sizer
    });
    

    //infinite scroll and content loading
    var win = $(window);

    var fillAndUpdate = function () {
      var hasSites = siteData.some(function(category) {
        return category.sites.length > 0;
      });
      console.log($(document).height() - $(window).height());
      console.log($(window).scrollTop());
      setTimeout(function() {
        if (hasSites && $(document).height() - $(window).height() == $(window).scrollTop()) {
        console.log('fill!');
        fillSitesRow(shuffle);
        updateView();
        }
      }, 500);

    }

    element.addEventListener(Shuffle.EventType.LAYOUT, fillAndUpdate);
    $(window).scroll(fillAndUpdate);

    fillCategories(shuffle);
    fillSitesRow(shuffle);
    updateView();
});

function fillSitesRow(shuffle) {
  var _elements = siteData
    .map(function(category) {
      var sites = category.sites.splice(0, 6);
      if (sites.length) {
        return sites.map(createSiteElement);
      } else {
        return null;
      }
    })

  var uls = $(shuffle.element).find('.category-wrap > ul');
  $.each(uls, function (index, ul) {
    var element = _elements[index];
    if (element) {
     $(ul).append(element);
    }
  });

  shuffle.update();
}

function fillCategories(shuffle) {
  var _elements = siteData
    .map(createCategoryElement)
    .map(function(category) {
      return category.get(0);
    });
    
  _elements.forEach(function(category) {
    shuffle.element.appendChild(category);
  });
  shuffle.add(_elements);
}

function createCategoryElement(category) {
  var root = $(document.createElement('div'));
  root.addClass('category-column col-lg-2 col-md-4 col-sm-6 col-xs-12');

  var wrap = $(document.createElement('div'));
  wrap.addClass('category-wrap');

  var heading = $(document.createElement('h1'));
  heading.text(category.name);

  var list = $(document.createElement('ul'));
  // category.sites.forEach(function(site) {
  //   list.append(createSiteElement(site));
  // });

  wrap.append([heading, list]);
  root.append(wrap);

  return root;
}

function createSiteElement(site) {
  if (site == null) {
    return null;
  }
  var root = $(document.createElement('li'));
  root.addClass('site site-' + site.methods.join(' site-'));
  
  var wrap = $(document.createElement('div'));
  wrap.addClass('flex-wrap');

  var icon = $(document.createElement('div'));
  icon.addClass('site-icon');
    icon.css('background', 'url("' + site.icon + '")');

  var text = $(document.createElement('div'));
  text.addClass('site-text');
    text.html(site.text);

  var methods = $(document.createElement('div'));
  methods.addClass('site-methods');
    methods.html('<i class="icon-paypal sk"></i><i class="icon-creditcard sk"></i><i class="icon-bitcoin sk"></i><i class="icon-skrill"></i>');

  var link = $(document.createElement('a'));
  link.attr('href', site.link);
  link.attr('target', '_blank');
    link.html('<span class="site-link-stub"></span>');

  wrap.append([icon, text, methods, link]);
  root.append(wrap);

  return root;
}