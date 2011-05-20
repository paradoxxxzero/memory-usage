// memory-usage: Gnome shell extension displaying your memory usage

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

        this._box = new St.BoxLayout();
        this._label = new St.Label({ text: "N/A" });
        this._icon = new St.Icon({ icon_type: St.IconType.SYMBOLIC, icon_size: Main.panel.button.height - 4, icon_name:'help-browser-symbolic'});
        this._box.add_actor(this._icon);
        this._box.add_actor(this._label);
        this.actor.set_child(this._box);

        this._menu_section_mem = new PopupMenu.PopupMenuSection("Memory");
        this.menu.addMenuItem(this._menu_section_mem);
        this._menu_item_mem = new PopupMenu.PopupMenuItem("Memory Usage:");
        this.__mem_info = new St.Label({ text: "N/A"})
        this._menu_item_mem.addActor(this.__mem_info)
        this._menu_item_mem.addActor(new St.Label({ text: "/"}))
        this.__mem_total_info = new St.Label({ text: "N/A"})
        this._menu_item_mem.addActor(this.__mem_total_info)
        this._menu_section_mem.addMenuItem(this._menu_item_mem);

        this._menu_section_swap = new PopupMenu.PopupMenuSection("Swap");
        this.menu.addMenuItem(this._menu_section_swap);
        this._menu_item_swap = new PopupMenu.PopupMenuItem("Swap Usage:");
        this.__swap_info = new St.Label({ text: "N/A"})
        this._menu_item_swap.addActor(this.__swap_info)
        this._menu_item_swap.addActor(new St.Label({ text: "/"}))
        this.__swap_total_info = new St.Label({ text: "N/A"})
        this._menu_item_swap.addActor(this.__swap_total_info)
        this._menu_section_mem.addMenuItem(this._menu_item_swap);

        GLib.timeout_add(0, 1000, function () {
            Panel.__memory_usage._update();
            return true;
        });
    },

    _update: function() {
        let free = GLib.spawn_command_line_sync('free -m');
        if(free[0]) {
            let free_lines = free[1].split("\n");
            let mem_params = free_lines[1].replace(/ +/g, " ").split(" ");
            let swap_params = free_lines[3].replace(/ +/g, " ").split(" ");
            let percentage = Math.round(mem_params[2]/mem_params[1]*100);
            Panel.__memory_usage._label.set_text(" " + percentage + "%");
            Panel.__memory_usage.__mem_info.set_text(mem_params[2] + "M");
            Panel.__memory_usage.__mem_total_info.set_text(mem_params[1] + "M");
            Panel.__memory_usage.__swap_info.set_text(swap_params[2] + "M");
            Panel.__memory_usage.__swap_total_info.set_text(swap_params[1] + "M");
        } else {
            Panel.__memory_usage._label.set_text("");
            Panel.__memory_usage._mem_info.set_text("Problem with `free -m` command");
            Panel.__memory_usage._swap_info.set_text("Problem with `free -m` command");
        }
    },

    _onDestroy: function() {}
};


function main() {
	Panel.STANDARD_TRAY_ICON_ORDER.unshift('memory-usage');
	Panel.STANDARD_TRAY_ICON_SHELL_IMPLEMENTATION['memory-usage'] = MemoryUsage;
}
