import { EventData, Page } from '@nativescript/core';
import { ExerciseViewModel } from './view-models/exercise-view-model';

export function navigatingTo(args: EventData) {
    try {
        console.log('Navigating to main page');
        const page = <Page>args.object;
        const viewModel = new ExerciseViewModel();
        page.bindingContext = viewModel;
        console.log('Main page navigation complete');
    } catch (error) {
        console.error('Error in navigatingTo:', error);
        throw error; // Re-throw to trigger uncaught error handler
    }
}

export function onLoaded(args: EventData) {
    console.log('Page loaded');
}