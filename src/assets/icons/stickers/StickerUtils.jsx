import {Bookmark} from "./Bookmark.jsx"
import {Stick} from "./Stick.jsx"
import {Calendar} from "./Calendar.jsx"
import {Check} from "./Check.jsx"
import {Cloud} from "./Cloud.jsx"
import {Dollar} from "./Dollar.jsx"
import {Edit} from "./Edit.jsx"
import {Fire} from "./Fire.jsx"
import {Flag} from "./Flag.jsx"
import {Flash} from "./Flash.jsx"
import {Geo} from "./Geo.jsx"
import {Cube} from "./Cube.jsx"
import {Eye} from "./Eye.jsx"
import {Brackets} from "./Brackets.jsx"
import {Heart} from "./Heart.jsx"
import {Idea} from "./Idea.jsx"
import {Image} from "./Image.jsx"
import {Key} from "./Key.jsx"
import {Layer} from "./Layer.jsx"
import {Music} from "./Music.jsx"
import {Pin} from "./Pin.jsx"
import {Priority} from "./Priority.jsx"
import {Security} from "./Security.jsx"
import {Settings} from "./Settings.jsx"
import {Star} from "./Star.jsx"
import {Timer} from "./Timer.jsx"
import {User} from "./User.jsx"
import {Video} from "./Video.jsx"

export const allStickerIcons = [
    'Stick',
    'Bookmark',
    'Heart',
    'Check',
    'Calendar',
    'Timer',
    'Cloud',
    'Dollar',
    'Edit',
    'Fire',
    'Cube',
    'Eye',
    'Brackets',
    'Flag',
    'Flash',
    'Geo',
    'Idea',
    'Image',
    'Video',
    'Music',
    'Key',
    'Layer',
    'Pin',
    'Priority',
    'Security',
    'Settings',
    'Star',
    'User',
]


export function StickerImage({image, color}) {

    let icon;
    switch (image) {
        case 'Bookmark' :
            icon = <Bookmark color={color}/>
            break;
        case 'Check' :
            icon = <Check color={color}/>
            break;
        case 'Cloud' :
            icon = <Cloud color={color}/>
            break;
        case 'Dollar' :
            icon = <Dollar color={color}/>
            break;
        case 'Calendar' :
            icon = <Calendar color={color}/>
            break;
        case 'Brackets' :
            icon = <Brackets color={color}/>
            break;
        case 'Eye' :
            icon = <Eye color={color}/>
            break;
        case 'Cube' :
            icon = <Cube color={color}/>
            break;
        case 'Stick' :
            icon = <Stick color={color}/>
            break;
        case 'Edit' :
            icon = <Edit color={color}/>
            break;
        case 'Fire' :
            icon = <Fire color={color}/>
            break;
        case 'Flag' :
            icon = <Flag color={color}/>
            break;
        case 'Flash' :
            icon = <Flash color={color}/>
            break;
        case 'Geo' :
            icon = <Geo color={color}/>
            break;
        case 'Heart' :
            icon = <Heart color={color}/>
            break;
        case 'Idea' :
            icon = <Idea color={color}/>
            break;
        case 'Image' :
            icon = <Image color={color}/>
            break;
        case 'Key' :
            icon = <Key color={color}/>
            break;
        case 'Layer' :
            icon = <Layer color={color}/>
            break;
        case 'Music' :
            icon = <Music color={color}/>
            break;
        case 'Pin' :
            icon = <Pin color={color}/>
            break;
        case 'Priority' :
            icon = <Priority color={color}/>
            break;
        case 'Security' :
            icon = <Security color={color}/>
            break;
        case 'Settings' :
            icon = <Settings color={color}/>
            break;
        case 'Star' :
            icon = <Star color={color}/>
            break;
        case 'Timer' :
            icon = <Timer color={color}/>
            break;
        case 'User' :
            icon = <User color={color}/>
            break;
        case 'Video' :
            icon = <Video color={color}/>
            break;

        default:
            icon = null
    }
    return (<>{icon}</>)

}