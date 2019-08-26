$(function() {
    var cacheProjects, cachePage, pageSize = 10,
        iconsReferences, projectFilter = '';

    iconsReferences = {

    }

    function sortProperties(obj) {
        var sortable = [];
        for (var key in obj)
            if (obj.hasOwnProperty(key))
                sortable.push([key, obj[key]]);

        sortable.sort(function(a, b) {
            return -(a[1] - b[1]);
        });
        return sortable;
    }

    function GetGithubProjectsByPage(account, page) {
        return $.get("https://api.github.com/users/" + account + "/repos?page=" + page);
    }

    function GetGithubProjects(account, callback, page) {
        var projects = [];
        if (!page) {
            page = 1;
        }

        GetGithubProjectsByPage(account, page)
            .done(function(data) {
                projects = projects.concat(data);

                if (data.length == 30) {
                    GetGithubProjects(account, function(childs) {
                        projects = projects.concat(childs);
                        callback(projects);
                    }, page + 1)
                } else {
                    callback(projects);
                }
            });

    }

    function ShowGithubPage(page) {
        var html, desc, projects, proj;
        $('#github-projects-details').html('');

        projects = [];

        for (var i in cacheProjects) {
            proj = cacheProjects[i];
            if (proj['name'].toLowerCase().includes(projectFilter) ||
                (proj['description'] != null && proj['description'].toLowerCase().includes(projectFilter)) ||
                (proj['language'] != null && proj['language'].toLowerCase().includes(projectFilter))) {
                projects.push(proj);
            }
        }

        for (i = 0; i < pageSize; i++) {
            proj = projects[page * pageSize + i];

            if (!proj) {
                break;
            }

            html = "<tr>"
            html += '<th class="has-text-white">';
            html += '<a target="_blank" rel="noopener" class="has-text-white" href="' + proj['html_url'] + '">'
            if (iconsReferences.hasOwnProperty(proj['language'])) {
                html += iconsReferences[proj['language']];
            } else {
                html += '<i class="fas fa-code-branch" aria-hidden="true"></i></span>';
            }
            html += ' ';
            html += proj['name'];
            html += '</a></th>';
            html += '<td class="has-text-white">';
            desc = proj['description'];

            if (desc == null) {
                desc = 'No description :-(';
            }

            html += desc.substring(0, 35);

            if (desc.length > 35) {
                html += '...';
            }

            html += '</td>';

            html += '<td class="has-text-white">';
            html += proj['stargazers_count'];
            html += '</td>';
            html += '</tr>';

            $('#github-projects-details').append(html);
        }
    }

    GetGithubProjects("JoseCarlosGarcia95", function(projects) {
        var stars = 0,
            forks = 0,
            html,
            offset, countbylanguage = {};

        cacheProjects = projects.sort((a, b) => (a.stargazers_count < b.stargazers_count) ? 1 : -1)
        cachePage = 0;
        $("#github-projects").text(projects.length);

        projects.forEach(function(proj) {
            if (!proj.fork) {
                stars += proj['stargazers_count'];

                forks += proj['forks'];

                if (!countbylanguage.hasOwnProperty(proj['language'])) {
                    countbylanguage[proj['language']] = 0;
                }

                countbylanguage[proj['language']]++;
            }
        });

        $("#github-stars").text(stars);
        $("#github-forks").text(forks);

        $('#github-previous-page').click(function() {
            if (cachePage == 0) {
                return;
            }

            cachePage--;

            ShowGithubPage(cachePage);
        });

        $('#github-next-page').click(function() {

            if (pageSize * (cachePage + 1) > cacheProjects.length) {
                return;
            }

            cachePage++;

            ShowGithubPage(cachePage);
        });

        countbylanguage = sortProperties(countbylanguage);

        $('#github-stats-details').html('');

        for (var language in countbylanguage) {
            html = '<tr>';
            html += '<th class="has-text-white">';
            html += countbylanguage[language][0];
            html += '</th>';
            html += '<td class="has-text-white">';
            html += countbylanguage[language][1];
            html += '</td>';
            html += '</tr>';

            $('#github-stats-details').append(html);
        }

        ShowGithubPage(0);

        $('#github-search-project').keyup(function(e) {
            projectFilter = $('#github-search-project').val().toLowerCase();
            ShowGithubPage(0);
        });
    });

    $('.github-tab').click(function() {
        var container = $(this).attr('id') + "-container";

        $('.github-tab-container').addClass('is-hidden');
        $('#' + container).removeClass('is-hidden');
    });
});