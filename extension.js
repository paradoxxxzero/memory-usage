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
        PanelMenu.SystemStatusButton.prototype._init.call(this, 'help-browser-symbolic', 'Memory Usage');

        this._box = new St.BoxLayout({ style_class: 'memory' });
        this._label = new St.Label({ text: this._usage() });
        this._icon = new St.Icon({ icon_type: St.IconType.SYMBOLIC, icon_size: Main.panel.button.height - 4, icon_name:'help-browser-symbolic'});
        this._box.add_actor(this._icon);
        this._box.add_actor(this._label);
        this.actor.set_child(this._box);

        this._menu_section = new PopupMenu.PopupMenuSection();
        this.menu.addMenuItem(this._menu_section);
        this._menu_item = new PopupMenu.PopupMenuItem("Memory Usage");
        this._menu_section.addMenuItem(this._menu_item);

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
            return " " + percentage + "%";
        }
        return "N/A";
    },

    _onDestroy: function() {}
};


function main() {
	Panel.STANDARD_TRAY_ICON_ORDER.unshift('memory-usage');
	Panel.STANDARD_TRAY_ICON_SHELL_IMPLEMENTATION['memory-usage'] = MemoryUsage;
}
