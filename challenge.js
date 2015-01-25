{
    init: function(elevators, floors) {
        var i;

        /*
        This function moves the closest available elevator to the floor @floorNum
        @param floorNum
        */
        var requestFloor = function(floorNum) {
            var currentLowestDelta = floors.length, thisDelta, elevatorFound = 0, elevator;

            // loop through each elevator
            for (i = 0; i < elevators.length; i++ ) {
                elevator = elevators[i];

                // find the distance between the current elevator and @floorNum
                thisDelta = Math.abs(floorNum - elevator.currentFloor());
                
                // check if this elevator is the closest elevator found so far in our loop
                if ( (thisDelta < currentLowestDelta) && (elevator.loadFactor() < .4) ) {
                    currentLowestDelta = thisDelta;
                    elevatorFound = i;
                }
            }

            // move found elevator to the floor @floorNum
            elevators[elevatorFound].goToFloor(floorNum);
        }
        
        /*
        Elevators loop
        assign event handlers for all elevators
        */
        for (i = 0; i < elevators.length; i++ ) {(function(i) {
            var elevator = elevators[i];
            
            elevator.on("idle", function() {

                // when: the elevator is idle
                // then: move the elevator to the ground floor
                elevator.goToFloor(0);
            });
 
            elevator.on("floor_button_pressed", function(floorNum) {

                // when: a floor button is pressed in the elevator
                // then: move the elevator to that floor
                elevator.goToFloor(floorNum);
            });
            
            elevator.on("stopped_at_floor", function(floorNum) {

                // when: the elevator is stopped at a floor
                // then: sort the queue to prefer the ground floor, this improves efficiency for
                //       certain challenges
                var newQueue = elevator.destinationQueue.filter(function(elem, pos) {
                    if (elem === floorNum) { return false; }
                    return elevator.destinationQueue.indexOf(elem) === pos;
                }).sort(function(a, b) { return a - b; });

                // assign and push the sorted queue
                elevator.destinationQueue = newQueue;
                elevator.checkDestinationQueue();
            });
        })(i);}
        

        /*
        Floors loop
        assign event handlers for all floors
        */
        for (i = 0; i < floors.length; i++ ) {(function(i) {
            var floor = floors[i];
            
            floor.on("up_button_pressed", function() {

                // when: the floor's up button is pressed
                // then: request the nearest elevator
                requestFloor(floor.floorNum());
            });
            floor.on("down_button_pressed", function() {

                // when: the floor's down button is pressed
                // then: request the nearest elevator
                requestFloor(floor.floorNum());
            });
        })(i);}
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}