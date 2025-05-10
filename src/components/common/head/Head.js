import React from 'react';
import { Helmet } from 'react-helmet';
import icon from '../../../images/eurovision-icon.png';

export default function Head({title}) {
    return (
        <Helmet>
            <title translation-id="head_title" >{title} | ESCV 2025</title>
            <link rel="icon" href={icon}/>
            <meta name="description" content="Eurovision Voting App"/>
            <meta name="keywords" content="Eurovision, Voting App, ESC, Eurovision Song Contest"/>
            <meta name="author" content="Aggelos Pipilikas"/>
            <meta charset="UTF-8"/>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <meta name="title" content="Default Title" data-react-helmet="true"/>
        </Helmet>
    );
}