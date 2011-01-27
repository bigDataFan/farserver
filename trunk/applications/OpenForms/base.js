$(document)
		.ready(
				function() {
					var d = false;
					var f = 0;
					var g = null;
					var c = $("#farea");
					var b = "<div>";
					_d = "</div>";
					o_ = "<option>";
					_o = "</option>";
					n = "\n";
					ce = ' contenteditable="true"';
					function h(j, l) {
						var k = "<label";
						if (l) {
							k += ' for="' + l + '"'
						}
						k += ">" + j + "</label>";
						return k
					}
					var e = function(k, p) {
						$.fn.removeClicked = function(q) {
							q.preventDefault();
							$(this).parent().detach()
						};
						var j = '<div id="' + p + '" class="felem" data-type="'
								+ k + '">';
						if (k != "button") {
							j += '<a href="#" class="ml excl">- collapse</a>'
						}
						j += '<a href="#" class="ml x" title="remove">x</a>';
						var o = ""/* b + h("placeholder", p + "_ph")
								+ '<input type=text id="' + p
								+ '_ph" name="eph">' + _d;*/
						lbl = '<div class="ml label ed"' + ce + ">" /*+ k*/
								+ " 描述" + _d;
						e_ = '<div class="element ' + k + '">';
						m = h("name", p + "_n") + '<input type="text" id="' + p
								+ '_n" name="ename" value="名称' + p + '"/>';
						s = '<div class="st">';
						if (k == "textbox") {
							j += lbl + e_ + s + o + b + m + _d + /*b
									+ h("type", p + "_0") + '<select id="' + p
									+ '_0" name="etype">' + o_ + "text" + _o
									+ o_ + "password" + _o + o_ + "email" + _o
									+ o_ + "number" + _o + o_ + "url" + _o + o_
									+ "hidden" + _o + "</select>" + _d
									+ '<div class="mm">' + h("min", p + "_1")
									+ '<input type="text" name="min" />' + _d
									+ '<div class="mm">' + h("max", p + "_1")
									+ '<input type="text" name="max" />' + _d
									+ *//*b + h("autocomplete", p + "_3")
									+ '<select id="' + p + '_3" name="eac">'
									+ o_ + "default" + _o + o_ + "on" + _o + o_
									+ "off" + _o + "</select>" + _d + *//*b
									+ '<input type="checkbox" name="ereq" id="'
									+ p + '_4" />' + h("required", p + "_4")
									+ _d + */_d
						} else {
							if (k == "textarea") {
								j += lbl + e_ + s + o + b + m + _d + _d
							} else {
								if (k == "select") {
									j += lbl
											+ e_
											+ s
											+ b
											+ m
											+ _d
											+ '<a href="#" class="addoption">+ 增加选项</a><div class="options">'
											+ _d + _d + _d
								} else {
									if (k == "button") {
										j += '<div class="button rg"><div'
												+ ce
												+ ' class="ename ed button rg">button name'
												+ _d + _d
									} else {
										j += "<div"
												+ ce
												+ ' class="ml element '
												+ k
												+ '">'
												+ lbl
												+ "</div>"
												+ s
												+ b
												+ m
												+ _d
												+ b
												+ '<input id="'
												+ p
												+ '_0" type=checkbox name=echecked />'
												+ h("checked", p + "_0") + _d
												+ _d
									}
								}
							}
						}
						j += _d;
						var l = $(j);
						l
								.find(".addoption")
								.click(
										function(q) {
											q.preventDefault();
											$(this)
													.next(".options")
													.append(
															'<div class="option">[ <div class="ed name"'
																	+ ce
																	+ '>name</div>, <div class="value ed"'
																	+ ce
																	+ '>value</div> ]<a href="#" title="remove" class="x">x</a></div>')
													.find(".x")
													.click(
															function(r) {
																$(this)
																		.removeClicked(
																				r)
															})
										});
						l.find(".excl").click(function(q) {
							q.preventDefault();
							var r = $(this).parent().find('*:not(".ml")');
							if ($(this).is(":contains(collapse)")) {
								r.fadeOut(200);
								$(this).text("+ expand")
							} else {
								r.fadeIn(200);
								$(this).text("- collapse")
							}
						});
						l.find(".x").click(function(q) {
							$(this).removeClicked(q)
						});
						l.find("[name=etype]").change(function() {
							var q = $(this).parents(".st").find(".mm");
							if ($(this).val() == "number") {
								q.fadeIn()
							} else {
								q.fadeOut()
							}
						});
						return l
					};
					function i() {
						var j = "<fieldset>\n";
						j += "<legend>" + $(".legend").text() + "</legend>\n";
						c
								.find(".felem")
								.each(
										function(l) {
											j += b + n;
											var o = $(this).attr("data-type");
											var v = "form" + $(this).attr("id");
											if (o != "button") {
												var q = ' id="' + v + '"';
												if ($(this)
														.find("[name=ename]")
														.val()) {
													q += ' name="'
															+ $(this)
																	.find(
																			"[name=ename]")
																	.val()
															+ '"'
												}
												label = '<label for="'
														+ v
														+ '">'
														+ $(this)
																.find(".label")
																.text()
														+ "</label><br>";
												if (o == "textbox") {
													var u = $(this).find(
															"[name=eph]").val();
													var p = $(this).find(
															"[name=eac]").val();
													var k = $(this).find(
															"[name=etype]")
															.val();
													j += label + "<input" + q
															+ " type=" + k;
													if (k == "number") {
														var r = $("[name=min]")
																.val();
														mx = $("[name=max]")
																.val();
														if (r) {
															j += ' min="' + r
																	+ '"'
														}
														if (mx) {
															j += ' max="' + mx
																	+ '"'
														}
													}
													if (u) {
														j += ' placeholder="'
																+ u + '"'
													}
													if ($(this).find(
															"[name=ereq]").is(
															":checked")) {
														j += " required"
													}
													if (p != "default") {
														j += " autocomplete="
																+ p
													}
													j += ">\n"
												} else {
													if (o == "textarea") {
														var u = $(this).find(
																"[name=eph]")
																.val();
														j += label
																+ "<textarea"
																+ q;
														if (u) {
															j += ' placeholder="'
																	+ u + '"'
														}
														j += "></textarea>\n"
													} else {
														if (o == "select") {
															j += label
																	+ "\n<select"
																	+ q + ">\n";
															$(this)
																	.find(
																			".options .option")
																	.each(
																			function(
																					t) {
																				j += "\t<option";
																				if ($(
																						this)
																						.find(
																								".value")
																						.text().length > 0) {
																					j += ' value="'
																							+ $(
																									this)
																									.find(
																											".value")
																									.text()
																							+ '"'
																				}
																				j += ">"
																						+ $(
																								this)
																								.find(
																										".name")
																								.text()
																						+ "</option>\n"
																			});
															j += "</select>\n"
														} else {
															j += "<input type="
																	+ o + q;
															if ($(
																	"[name=echecked]")
																	.is(
																			":checked")) {
																j += " checked=checked"
															}
															j += ">" + label
																	+ n
														}
													}
												}
											} else {
												j += '<input type=submit value="'
														+ $(this)
																.find(".ename")
																.text()
														+ '">'
														+ n
											}
											j += _d + n
										});
						j += "</fieldset>";
						$("#uform").html(j);
						html = j.replace(/</g, "&lt;").replace(/>/g, "&gt;");
						$("#uhtml").html("<code>" + html + "</code>")
						return j;
					}
					function a() {
						idprefix = "_element_";
						elementsid = c.find(".felem");
						return idprefix + (elementsid.length)
					}
					$("#src a").click(function(k) {
						k.preventDefault();
						var j = e($(this).attr("data-type"), a());
						j.mousedown(function(l) {
							d = true;
							g = $(this);
							f = l.pageY;
							$(".felem").removeClass("nos")
						}).mouseup(function(l) {
							if (d && g.attr("id") != $(this).attr("id")) {
								if (f > l.pageY) {
									g.insertBefore($(this))
								} else {
									g.insertAfter($(this))
								}
							}
							$(".felem").removeClass("nos");
							g = null;
							d = false
						}).mousemove(function(l) {
							if (d) {
								$(".felem").addClass("nos")
							}
						});
						c.append(j)
					});
					$(".showhtml a").click(function() {
						i()
					});
					$(".clear a").click(function() {
						c.html("");
						$("#uhtml, #uform").html("")
					});
					$(".tl a").click(function(j) {
						j.preventDefault();
						if (!$(this).hasClass("active")) {
							$(".tp").hide();
							$(".tl a").removeClass("active");
							$($(this).attr("href")).show();
							$(this).addClass("active")
						}
					})
					
					
					
					
					$('#link_save').click(
							function() {
								var s = i();
								alert(s);
							}
					);
				});