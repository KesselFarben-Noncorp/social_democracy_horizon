title: [+ year +] Party Congress of the SPD
tags: event
max-visits: 1
view-if: sandbox = 1
on-arrival: {!

var FRACTIONS = [
    { key: 'left',           label: 'Left',           ideo: 2 },
    { key: 'center',         label: 'Orthodox',       ideo: 3 },
    { key: 'labor',          label: 'ADGB',           ideo: 4 },
    { key: 'reformist',      label: 'Reformist',      ideo: 5 },
    { key: 'neorevisionist', label: 'Neorevisionist', ideo: 6 },
];

var _active = [];
for (var fi = 0; fi < FRACTIONS.length; fi++) {
    var _f = FRACTIONS[fi];
    if (_f.key === 'neorevisionist' && !Q.neorevisionism) continue;
    var _str = Q[_f.key + '_strength'] || 0;
    if (_str <= 0) continue;
    _active.push({ key: _f.key, label: _f.label, ideo: _f.ideo, str: _str });
}

var _total = 0;
for (var i = 0; i < _active.length; i++) _total += _active[i].str;
var _majority = _total / 2;

// ============================================
// BLOC FORMATION — ideological proximity merge
// ============================================

var _blocs = [];
for (var i = 0; i < _active.length; i++) {
    _blocs.push({
        fractions: [_active[i].key],
        labels:    [_active[i].label],
        str:       _active[i].str,
        ideo_sum:  _active[i].ideo * _active[i].str,
    });
}

var _keep_merging = true;
while (_keep_merging && _blocs.length > 1) {
    var _has_majority = false;
    for (var i = 0; i < _blocs.length; i++) {
        if (_blocs[i].str > _majority) { _has_majority = true; break; }
    }
    if (_has_majority) break;

    // Find adjacent pair with smallest ideo gap
    var _best_gap = 999;
    var _best_idx = 0;
    for (var i = 0; i < _blocs.length - 1; i++) {
        var _ideo_a = _blocs[i].ideo_sum   / _blocs[i].str;
        var _ideo_b = _blocs[i+1].ideo_sum / _blocs[i+1].str;
        var _gap    = Math.abs(_ideo_a - _ideo_b);
        if (_gap < _best_gap) { _best_gap = _gap; _best_idx = i; }
    }

    var _a = _blocs[_best_idx];
    var _b = _blocs[_best_idx + 1];
    var _merged_bloc = {
        fractions: _a.fractions.concat(_b.fractions),
        labels:    _a.labels.concat(_b.labels),
        str:       _a.str + _b.str,
        ideo_sum:  _a.ideo_sum + _b.ideo_sum,
    };
    _blocs.splice(_best_idx, 2, _merged_bloc);

    if (_merged_bloc.str > _majority) { _keep_merging = false; }
}

// Find winning bloc — majority holder, else largest
var _winner_idx = 0;
var _winner_str = 0;
for (var i = 0; i < _blocs.length; i++) {
    if (_blocs[i].str > _winner_str) { _winner_str = _blocs[i].str; _winner_idx = i; }
}
var _winner_bloc = _blocs[_winner_idx];

// ============================================
// OUTCOME
// ============================================

var _new_ideo = Math.round(_winner_bloc.ideo_sum / _winner_bloc.str);
var _old_ideo = Q.spd_ideo || 4;
Q.spd_ideo = _new_ideo;

var _dom_str   = 0;
var _dom_key   = '';
var _dom_label = '';
for (var i = 0; i < _winner_bloc.fractions.length; i++) {
    var _fk = _winner_bloc.fractions[i];
    var _fs = Q[_fk + '_strength'] || 0;
    if (_fs > _dom_str) { _dom_str = _fs; _dom_key = _fk; }
}
for (var fi = 0; fi < FRACTIONS.length; fi++) {
    if (FRACTIONS[fi].key === _dom_key) { _dom_label = FRACTIONS[fi].label; break; }
}

Q.spd_congress_winner_label = _winner_bloc.labels.join(' + ');
Q.spd_congress_winner_str   = _winner_bloc.str;
Q.spd_congress_dominant     = _dom_label;
Q.spd_congress_new_ideo     = _new_ideo;
Q.spd_congress_old_ideo     = _old_ideo;
Q.spd_congress_ideo_shift   = _new_ideo - _old_ideo;
Q.spd_congress_had_majority = (_winner_bloc.str > _majority) ? 1 : 0;
Q.spd_congress_bloc_count   = _blocs.length;

// Serialise fraction data for on-display
var _fdata = [];
for (var i = 0; i < _active.length; i++) {
    var _af      = _active[i];
    var _in_win  = (_winner_bloc.fractions.indexOf(_af.key) >= 0) ? 1 : 0;
    _fdata.push(_af.key + ':' + _af.str + ':' + _in_win);
}
Q.spd_congress_fdata = _fdata.join(',');
!}
on-display: {!
var FRACTION_COLORS = {
    left:           '#6b1a1a',
    center:         '#a32222',
    labor:          '#c0392b',
    reformist:      '#d97c7c',
    neorevisionist: '#e8b4b4',
};

var FRACTION_LABELS = {
    left:           'Left',
    center:         'Orthodox',
    labor:          'ADGB',
    reformist:      'Reformist',
    neorevisionist: 'Neorevisionist',
};

var _fdata_raw = Q.spd_congress_fdata || '';
var _fentries  = _fdata_raw ? _fdata_raw.split(',') : [];

var _fracs     = [];
var _total_str = 0;
for (var i = 0; i < _fentries.length; i++) {
    var _parts = _fentries[i].split(':');
    if (_parts.length < 3) continue;
    var _entry = { key: _parts[0], str: parseInt(_parts[1]), in_winner: parseInt(_parts[2]) };
    _fracs.push(_entry);
    _total_str += _entry.str;
}

var _bar = '<div style="margin:14px 0 4px;font-size:0.82em;color:#888;letter-spacing:0.05em;text-transform:uppercase;">Fraction Strength</div>';
_bar += '<div style="display:flex;width:100%;height:32px;border-radius:2px;overflow:hidden;border:1px solid #2a2a2a;">';

for (var i = 0; i < _fracs.length; i++) {
    var _f   = _fracs[i];
    var _pct = (_total_str > 0) ? (_f.str / _total_str * 100).toFixed(2) : 0;
    var _col = FRACTION_COLORS[_f.key] || '#555';
    var _dim = _f.in_winner ? '' : 'filter:brightness(0.4);';
    _bar += '<div style="width:' + _pct + '%;background:' + _col + ';' + _dim
        + 'display:flex;align-items:center;justify-content:center;'
        + 'font-size:0.73em;color:rgba(255,255,255,0.85);font-weight:600;overflow:hidden;white-space:nowrap;">'
        + (_pct > 9 ? FRACTION_LABELS[_f.key] : '')
        + '</div>';
}
_bar += '</div>';

// Strength labels below bar
_bar += '<div style="display:flex;width:100%;margin-top:3px;font-size:0.76em;">';
for (var i = 0; i < _fracs.length; i++) {
    var _f   = _fracs[i];
    var _pct = (_total_str > 0) ? (_f.str / _total_str * 100).toFixed(2) : 0;
    var _hi  = _f.in_winner ? '#ccc' : '#444';
    _bar += '<div style="width:' + _pct + '%;text-align:center;color:' + _hi + ';">' + _f.str + '</div>';
}
_bar += '</div>';

// Legend
_bar += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;font-size:0.78em;color:#777;">';
for (var i = 0; i < _fracs.length; i++) {
    var _f   = _fracs[i];
    var _col = FRACTION_COLORS[_f.key] || '#555';
    var _dim = _f.in_winner ? '1' : '0.4';
    _bar += '<span style="opacity:' + _dim + ';">'
        + '<span style="display:inline-block;width:9px;height:9px;background:' + _col
        + ';border-radius:1px;margin-right:3px;vertical-align:middle;"></span>'
        + FRACTION_LABELS[_f.key]
        + '</span>';
}
_bar += '</div>';

var _el = document.getElementById('congress-bar');
if (_el) _el.innerHTML = _bar;

!}

= SPD Party Congress

The delegates have assembled. The fractions take their positions.

{!<div id="congress-bar" style="margin-bottom:16px;"></div>!}

[? if spd_congress_bloc_count = 1 : No coalition was needed — a single bloc commands the congress. ?]
[? if spd_congress_bloc_count > 1 and spd_congress_had_majority = 1 : The fractions divided into [+ spd_congress_bloc_count +] blocs. One secured a clear majority. ?]
[? if spd_congress_bloc_count > 1 and spd_congress_had_majority = 0 : The congress is fragmented. No bloc commands a majority — the largest carries the day. ?]

**[+ spd_congress_winner_label +]** prevails, led by the **[+ spd_congress_dominant +]** fraction.

[? if spd_congress_ideo_shift < -1 : The party moves sharply to the left. The new leadership will push an assertive socialist programme. ?]
[? if spd_congress_ideo_shift = -1 : The party shifts left. The reformists lose ground. ?]
[? if spd_congress_ideo_shift = 0 : The balance of power holds. The party's ideological position is unchanged. ?]
[? if spd_congress_ideo_shift = 1 : The party shifts toward the centre. The left fraction voices its displeasure. ?]
[? if spd_congress_ideo_shift > 1 : A decisive shift rightward. The left fraction is in open protest. ?]

Party ideological position: **[+ spd_congress_old_ideo +] → [+ spd_congress_new_ideo +]**

- @root: Continue
