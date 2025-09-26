(function(w) {
    function getJsonI18N() {
        // https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/language
        
        const LANGUAGES = [
            { regex: /^zh-CN\b/, lang: 'zh' },
            { regex: /^zh-TW\b/, lang: 'zht' },
            { regex: /^zh-HK\b/, lang: 'zht' },
            { regex: /^zh-MO\b/, lang: 'zht' },
            { regex: /^zh-cn\b/, lang: 'zh' },
            { regex: /^zh-tw\b/, lang: 'zht' },
            { regex: /^zh-hk\b/, lang: 'zht' },
            { regex: /^zh-mo\b/, lang: 'zht' },
            { regex: /^ja\b/, lang: 'ja' },
            { regex: /.*/, lang: 'en'}
        ]

        const lang = LANGUAGES.find(l => l.regex.test(navigator.language)).lang
        
        return $.ajax({
            url: `./static/i18n/${lang}.json`,
            dataType: 'json',
            method: 'GET',
            async: false,
            success: data => res = data,
            error: () => alert('找不到语言文件: ' + lang)
        }).responseJSON
    }

    const I18N = getJsonI18N()

    $('[data-i18n]').each(function() {
        const content = I18N[this.dataset.i18n];
        $(this).text(content);
    });

    $('[data-placeholder-i18n]').each(function() {
        $(this).attr('placeholder', I18N[this.dataset.placeholderI18n]);
    });

    $('html').attr('lang', I18N['lang']);
}) (window);