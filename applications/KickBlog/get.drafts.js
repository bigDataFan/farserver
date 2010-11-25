var blogService = extension.getBlogService();

var model = new Object();
model.items = blogService.getAllDrafts();
model.count = model.items.length;

model;