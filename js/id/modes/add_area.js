iD.modes.AddArea = function(context, option) {
    var mode = {
        id: 'add-area',
        button: 'area',
        title: t('modes.add_area.title'),
        description: t('modes.add_area.description'),
        key: '3',
        option: option
    };

    var behavior = iD.behavior.AddWay(context)
            .tail(t('modes.add_area.tail'))
            .on('start', start)
            .on('startFromWay', startFromWay)
            .on('startFromNode', startFromNode),
        defaultTags = {area: 'yes'};

    function start(loc) {
        var graph = context.graph(),
            node = iD.Node({loc: loc}),
            way = iD.Way({tags: defaultTags});

        context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id),
            iD.actions.AddVertex(way.id, node.id));

        context.enter(iD.modes.DrawArea(context, way.id, graph, mode.option));
    }

    function startFromWay(loc, edge) {
        var graph = context.graph(),
            node = iD.Node({loc: loc}),
            way = iD.Way({tags: defaultTags});

        context.perform(
            iD.actions.AddEntity(node),
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id),
            iD.actions.AddVertex(way.id, node.id),
            iD.actions.AddMidpoint({ loc: loc, edge: edge }, node));

        context.enter(iD.modes.DrawArea(context, way.id, graph, mode.option));
    }

    function startFromNode(node) {
        var graph = context.graph(),
            way = iD.Way({tags: defaultTags});

        context.perform(
            iD.actions.AddEntity(way),
            iD.actions.AddVertex(way.id, node.id),
            iD.actions.AddVertex(way.id, node.id));

        context.enter(iD.modes.DrawArea(context, way.id, graph, mode.option));
    }

    mode.enter = function() {
        context.install(behavior);
    };

    mode.exit = function() {
        mode.option = option;  // reset
        context.uninstall(behavior);
    };

    return mode;
};
