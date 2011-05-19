// memory-usage: Gnome shell extensior displaying your memory usage

// Copyright (C) 2011 Florian Mounier aka paradoxxxzero

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// Author: Florian Mounier aka paradoxxxzero
// Description :
//   This is an emacs major mode for jinja2 with:
//        syntax highlighting
//        sgml/html integration
//        indentation (working with sgml)
//        more to come

const St = imports.gi.St;
const GLib = imports.gi.GLib;
const Mainloop = imports.mainloop;
const Main = imports.ui.main;
const Shell = imports.gi.Shell;
const Lang = imports.lang;
const Panel = imports.ui.panel;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const MessageTray = imports.ui.messageTray;

function MemoryUsage() {
    this._init.apply(this, arguments);
}

MemoryUsage.prototype = {
    __proto__: PanelMenu.SystemStatusButton.prototype,

    _init: function() {
	    Panel.__memory_usage = this;
        PanelMenu.SystemStatusButton.prototype._init.call(this, 'folder', 'Memory Usage');
        this._label = new St.Label({ style_class: 'memory-label', text: this._usage() });
        this.actor.set_child(this._label);
        GLib.timeout_add(0, 1000, function () {
            Panel.__memory_usage._label.set_text(Panel.__memory_usage._usage());
            return true;
        });
    },

    _usage: function() {
        global.log(this);
        global.log(this._label);
        let free = GLib.spawn_command_line_sync('free -m');
        if(free[0]) {
            let free_lines = free[1].split("\n");
            let mem_params = free_lines[1].replace(/ +/g, " ").split(" ");
            let percentage = Math.round(mem_params[2]/mem_params[1]*100);
            return percentage + "%";
        }
        return "N/A";
    },

    _onDestroy: function() {}
};


function main() {
	Panel.STANDARD_TRAY_ICON_ORDER.unshift('memory-usage');
	Panel.STANDARD_TRAY_ICON_SHELL_IMPLEMENTATION['memory-usage'] = MemoryUsage;
}
