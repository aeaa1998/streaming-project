<?php

namespace App\Http\Utils;

class Constants
{
    const ALBUMS_BY_ARTIST = "
        -- Artistas con más albumes publicados (albumsByArtists)
        SELECT A.name as description, COUNT(*) as quantity
        FROM album ALB
        INNER JOIN artist A
        ON ALB.artistid = A.artistid
        GROUP BY A.name 
        ORDER BY COUNT(*) DESC
        LIMIT 10;
    ";
    const SONGS_BY_GENRE = "
        -- Géneros con más canciones
        SELECT g.name as description, COUNT(*) as quantity
        FROM track t
        INNER JOIN genre g
        ON t.genreid = g.genreid
        GROUP BY g.name
        ORDER BY COUNT(*) DESC
        LIMIT 20;
    ";
    const DURATION_BY_PLAYLIST = "
        -- Total de duración de cada playlist (segundos)
        SELECT PL.name as description, SUM(T.milliseconds)/1000 as quantity
        FROM playlisttrack PLT
        INNER JOIN playlist PL
        ON PL.playlistid = PLT.playlistid
        INNER JOIN track T
        ON T.trackid = PLT.trackid
        GROUP BY PL.name, PL.playlistid
        ORDER BY SUM(T.milliseconds) DESC;
    ";
    const DURATION_BY_SONG = "
        -- Canciones de mayor duración con la información de sus artistas
        SELECT (T.name, A.name) as description, T.milliseconds as quantity
        FROM track T 
        INNER JOIN album ALB
        ON T.albumid = ALB.albumid
        INNER JOIN artist A
        ON ALB.artistid = A.artistid
        ORDER BY T.milliseconds DESC
        LIMIT 5;
    ";
    const SONGS_BY_ARTIST = "
        -- Artistas que han registrado más canciones (songsByArtists)
        SELECT A.name as description, COUNT(*) as quantity
        FROM artist A
        INNER JOIN album ALB 
        ON ALB.artistid = A.artistid
        INNER JOIN track T 
        ON ALB.albumid = T.albumid
        GROUP BY A.name
        ORDER BY COUNT(*) DESC
        LIMIT 10;
    ";
    const DURATION_BY_GENRE = "
        -- Promedio de duración de canciones por género
        SELECT G.name as description, AVG(T.milliseconds) as quantity
        FROM genre G
        INNER JOIN track T
        ON G.genreid = T.genreid
        GROUP BY G.name
        ORDER BY AVG(T.milliseconds) DESC;
    ";
    const ARTIST_BY_PLAYLIST = "
        -- Cantidad de artistas diferentes por playlist
        SELECT PL.name as description, COUNT (DISTINCT A.artistid) as quantity
        FROM playlist PL 
        INNER JOIN playlisttrack PLT 
        ON PL.playlistid = PLT.playlistid
        INNER JOIN track T
        ON T.trackid = PLT.trackid
        INNER JOIN album ALB
        ON T.albumid = ALB.albumid
        INNER JOIN artist A 
        ON ALB.artistid = A.artistid
        GROUP BY PL.name, PL.playlistid
        ORDER BY COUNT(DISTINCT A.artistid) DESC;
    ";
    const GENRES_BY_ARTIST = "
        -- Los artistas con más diversidad de géneros musicales
        SELECT A.name as description, COUNT(DISTINCT T.genreid) as quantity
        FROM album ALB
        INNER JOIN artist A
        ON ALB.artistid = A.artistid
        INNER JOIN track T 
        ON ALB.albumid = T.albumid
        GROUP BY A.name, A.artistid
        ORDER BY COUNT(DISTINCT T.genreid) DESC
        LIMIT 10;
    ";

    const ARTIST_URL = "select artistid as id, name from Artist";
    const USER_URL = "select userid as id, users.name as name, users.email as email, role.name as rol, SubsriptionType.name as subs from users inner join Role on role.roleid = users.roleid
    inner join SubsriptionType on SubsriptionType.subscriptionTypeId = users.subscriptionTypeId
     where users.userid != 1";
    const ALBUM_URL = "select Album.albumid as id, Album.title, Artist.name as artista  from Album inner join Artist on Album.artistid = Artist.artistid";
    const GENRES_URL = "select genreid as id, name from Genre";
    const CART_SELECT = "select CartTracks.id, CartTracks.quantity as quantity, Track.name as name
     from CartTracks 
     inner join 
     ";
    const SONGS_URL = "select Track.TrackId as id, Track.name as name, Track.Composer as composer, Track.milliseconds as miliseconds, Artist.name as Name_Artist, Album.title as album, Genre.name as genero, Track.isActive as isActive from Track inner join Genre on Genre.GenreId = Track.GenreId inner join Album on Album.AlbumId = Track.AlbumId inner join Artist on Artist.artistid = Album.artistid";
    const ARTIST_FILTERS = [
        "Id" => [
            "operator" => "=",
            "column" => "artistid",
            "type" => "number",
            "tableName" => "id"
        ],
        "Nombre Artista"  => [
            "operator" => "LIKE",
            "column" => "name",
            "type" => "text",
            "columnEdit" => "name",
            "tableName" => "name"
        ],
    ];

    const USER_FILTERS = [
        "Id" => [
            "operator" => "=",
            "column" => "id",
            "type" => "number",
            "tableName" => "id"
        ],
        "Nombre Usuario"  => [
            "operator" => "LIKE",
            "column" => "users.name",
            "type" => "text",
            "columnEdit" => "name",
            "tableName" => "name"
        ],

        "Email"  => [
            "operator" => "LIKE",
            "column" => "users.email",
            "type" => "text",
            "columnEdit" => "email",
            "tableName" => "email"
        ],
    ];
    const ALBUM_FILTERS = [
        "Id" => [
            "operator" => "=",
            "column" => "Album.albumid",
            "type" => "number",
            "tableName" => "id"
        ],
        "Nombre Album"  => [
            "operator" => "LIKE",
            "column" => "Album.title",
            "type" => "text",
            "columnEdit" => "title",
            "tableName" => "title"
        ],
    ];


    const GENRE_FILTERS = [
        "Id" => [
            "operator" => "=",
            "column" => "Genre.genreid",
            "type" => "number",
            "tableName" => "id"
        ],
        "Genero"  => [
            "operator" => "LIKE",
            "column" => "Genre.name",
            "type" => "text",
            "columnEdit" => "name",
            "tableName" => "name"
        ],
    ];

    const SONG_FILTERS = [
        "Id" => [
            "operator" => "=",
            "column" => "Track.TrackId",
            "type" => "number",
            "tableName" => "id"
        ],
        "Artista" => [
            "operator" => "LIKE",
            "column" => "Artist.name",
            "type" => "text",
            "tableName" => "name_artist"
        ],
        "Nombre" => [
            "operator" => "LIKE",
            "column" => "Track.name",
            "columnEdit" => "name",
            "type" => "text",
            "tableName" => "name"
        ],
        "Compositor" => [
            "operator" => "LIKE",
            "column" => "Track.composer",
            "columnEdit" => "composer",
            "type" => "text",
            "tableName" => "composer"
        ],
        "Milisegundos" => [
            "operator" => "=",
            "column" => "Track.milliseconds",
            "columnEdit" => "milliseconds",
            "type" => "number",
            "tableName" => "miliseconds"
        ],
    ];

    const CREATE_SONGS =        [
        [
            "column" => "name",
            "name" => "Nombre de la cancion",
            "type" => "text",
            "value" => ""
        ],
        [
            "column" => "composer",
            "name" => "Compositor",
            "type" => "text",
            "value" => ""
        ],
        [
            "column" => "milliseconds",
            "name" => "Milisegundos",
            "type" => "number",
            "value" => ""
        ],
        [
            "column" => "bytes",
            "name" => "Bytes",
            "type" => "number",
            "value" => ""
        ],
        [
            "column" => "unitprice",
            "name" => "Precio",
            "type" => "double",
            "value" => ""
        ],
    ];

    const CREATE_ARTIST =        [
        [
            "column" => "name",
            "name" => "Nombre del Artista",
            "type" => "text",
            "value" => ""
        ],
    ];


    const CREATE_USER =        [
        [
            "column" => "name",
            "name" => "Nombre del Usuario",
            "type" => "text",
            "value" => ""
        ],
        [
            "column" => "email",
            "name" => "Email",
            "type" => "text",
            "value" => ""
        ],
        [
            "column" => "password",
            "name" => "Contraseña",
            "type" => "text",
            "value" => ""
        ],
    ];

    const CREATE_GENRE =        [
        [
            "column" => "name",
            "name" => "Nombre del Genero",
            "type" => "text",
            "value" => ""
        ],
    ];


    const CREATE_ALBUM =        [
        [
            "column" => "title",
            "name" => "Titulo del Album",
            "type" => "text",
            "value" => ""
        ],
    ];
}
