var APP_DATA = {
  "scenes": [
    {
      "id": "0-startpoint",
      "name": "StartPoint",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "yaw": -2.1504851642258274,
        "pitch": 0.01373073663395985,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 2.6327559239599783,
          "pitch": 0.6449583348333725,
          "rotation": 0,
          "target": "1-couartyard"
        }
      ],
      "infoHotspots": [
        {
          "yaw": -2.470365721932369,
          "pitch": 0.23515439052942,
          "title": "SWITCH-1",
          "text": "IN TO EL-SEN-1"
        },
        {
          "yaw": -2.454622688017027,
          "pitch": -0.5324674187505352,
          "title": "<p>EL-Service Entre Node -1</p><p>( EL-SEN -1)</p>",
          "text": "Electrical System"
        },
        {
          "yaw": -2.117722484815385,
          "pitch": -0.1552527131278758,
          "title": "LIGHT-END-1",
          "text": "IN TO JN-EL-7"
        },
        {
          "yaw": -0.9087469708788909,
          "pitch": -0.2851110633639866,
          "title": "JN-EL-9",
          "text": "IN TO JN-EL-8"
        },
        {
          "yaw": -1.2509996776079255,
          "pitch": -0.47745830562517,
          "title": "JN-EL-8",
          "text": "JN-EL-7 TO&nbsp; JN-EL-9"
        },
        {
          "yaw": -1.5885621883103767,
          "pitch": -0.1331234556514893,
          "title": "LIGHT-END-3",
          "text": "IN TO JN-EL-9"
        },
        {
          "yaw": -1.8223465103821486,
          "pitch": -0.15551298954678572,
          "title": "LIGHT-END-2",
          "text": "IN TO JN-EL-8"
        },
        {
          "yaw": -2.174296578290896,
          "pitch": 0.21369787435827448,
          "title": "JN-PW-3",
          "text": "JN-PW-2 TO&nbsp; FAUCET-END"
        },
        {
          "yaw": -2.4698527488488295,
          "pitch": 0.6820696940627222,
          "title": "JN-PW-2",
          "text": "PW=SEN-11 TO JN-PW-3"
        },
        {
          "yaw": 2.7603338151945156,
          "pitch": 0.1112722623896012,
          "title": "<p>PW-Service Entre Node -1</p>\n<p>( PW-SEN -1)</p>",
          "text": "Plumbing System"
        },
        {
          "yaw": -2.2341672981722382,
          "pitch": -0.655545138807966,
          "title": "JN-EL-7",
          "text": "&nbsp;EL-SEN-1 TO JN-EL-8"
        },
        {
          "yaw": -2.1850861476231707,
          "pitch": 0.10332288115658272,
          "title": "FAUCET-1",
          "text": "IN TO JN-PW-3"
        }
      ]
    },
    {
      "id": "1-couartyard",
      "name": "CouartYard",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "yaw": 0.5817570797114815,
        "pitch": -0.1051835199332043,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 2.988659812744161,
          "pitch": 0.6191057948427741,
          "rotation": 0,
          "target": "0-startpoint"
        },
        {
          "yaw": 1.4727712420223664,
          "pitch": 0.4557000643267095,
          "rotation": 0,
          "target": "2-groundhall"
        }
      ],
      "infoHotspots": [
        {
          "yaw": 0.1113006620815522,
          "pitch": 0.13022954378986817,
          "title": "<p>PW-Service Entre Node -1</p>\n<p>( PW-SEN -1)</p>",
          "text": "Plumbing System"
        },
        {
          "yaw": 2.3642637152148085,
          "pitch": 0.3994269975065752,
          "title": "JN-PW-2",
          "text": "&nbsp;TO PW-SEN-1"
        },
        {
          "yaw": 2.6531505416899153,
          "pitch": 0.29701749499661645,
          "title": "water",
          "text": "pipe"
        },
        {
          "yaw": -0.42308234430018565,
          "pitch": -0.39058680196246165,
          "title": "LIGHT-END-2",
          "text": "IN TO LIGHT-ROOT"
        },
        {
          "yaw": 0.5465392881944666,
          "pitch": -0.33786110703820604,
          "title": "LIGHT-END-1",
          "text": "IN TO EL-SEN-2"
        },
        {
          "yaw": 1.4573783862017962,
          "pitch": -0.5478939933409332,
          "title": "<p>EL-Service Entre Node -2</p>\n<p>( EL-SEN -2)</p>",
          "text": "Electrical System"
        },
        {
          "yaw": -1.6667979701548088,
          "pitch": -0.961081462254544,
          "title": "LIGHT-ROOT",
          "text": "EL-SEN-2 TO LIGHT-END-2"
        },
        {
          "yaw": 0.1596606749722671,
          "pitch": -0.694256962983621,
          "title": "&nbsp;A FAN",
          "text": "TO EL-SEN-2&nbsp;"
        }
      ]
    },
    {
      "id": "2-groundhall",
      "name": "GroundHall",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "yaw": -3.0556877483562808,
        "pitch": 0.05691599761243715,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -1.8095225947093319,
          "pitch": 0.269258823848201,
          "rotation": 6.283185307179586,
          "target": "1-couartyard"
        },
        {
          "yaw": -0.027632999259720847,
          "pitch": 0.3815034656402112,
          "rotation": 1.5707963267948966,
          "target": "3-groundkichin"
        }
      ],
      "infoHotspots": [
        {
          "yaw": -3.0555160735912956,
          "pitch": 0.42212420988346366,
          "title": "SOCKET-2",
          "text": "IN TO EL-SNE"
        },
        {
          "yaw": -3.084976181048857,
          "pitch": -0.3836167254259806,
          "title": "EL-Service Entre Node<div>&nbsp;( EL-SEN )</div>",
          "text": "Electrical System"
        },
        {
          "yaw": -3.0955607300168477,
          "pitch": -0.5217406849073853,
          "title": "JN-EL-1",
          "text": "EL-SEN TO JN-EL-2&nbsp;&nbsp;"
        },
        {
          "yaw": -2.036901112934366,
          "pitch": -0.17245234196082393,
          "title": "LIGHT-END-1",
          "text": "&nbsp;IN TO JN-EL-1"
        },
        {
          "yaw": -3.039156194859565,
          "pitch": -0.8058594543017712,
          "title": "<p>JN-EL-2</p>",
          "text": "JN-EL-1 ( IN ) TO JN-EL-3"
        },
        {
          "yaw": -1.703225949664045,
          "pitch": -0.18324410558997073,
          "title": "LIGHT-END-2",
          "text": "IN TO JN-EL-3"
        },
        {
          "yaw": -2.2943612687555763,
          "pitch": -1.405543776073749,
          "title": "<p>JN-EL-3</p>",
          "text": "JN-EL-2 TO JN-EL-4"
        },
        {
          "yaw": -0.4367122132234833,
          "pitch": -1.1303547748617984,
          "title": "JN-EL-4",
          "text": "JN-EL-3 TO JN-EL-5"
        },
        {
          "yaw": -0.1073411195062608,
          "pitch": -0.13075107991911317,
          "title": "LIGHT-END-7",
          "text": "&nbsp;TO JN-EL-6"
        },
        {
          "yaw": -1.3512657053522226,
          "pitch": -0.17536936153982907,
          "title": "LIGHT-END-3",
          "text": "IN TO JN-EL-6"
        },
        {
          "yaw": -0.10124529549506533,
          "pitch": -0.6917418905512402,
          "title": "JN-EL-5",
          "text": "JN-EL-4 TO JN-EL-6"
        },
        {
          "yaw": 1.9000717602417447,
          "pitch": -0.23191922492261696,
          "title": "<p>LIGHT-END-4</p>",
          "text": "IN TO JN-EL-1"
        },
        {
          "yaw": 1.6530356098678842,
          "pitch": -0.2518592786854654,
          "title": "LIGHT-END-5",
          "text": "TO JN-EL-2"
        },
        {
          "yaw": 1.1419426572063696,
          "pitch": -0.2423591786345014,
          "title": "LIGHT-END-7",
          "text": "TO JN-EL-5"
        },
        {
          "yaw": 1.3889331395798479,
          "pitch": -0.2575142766357459,
          "title": "LIGHT-END-6",
          "text": "&nbsp;TO JN-EL-4"
        },
        {
          "yaw": -0.09704838738560362,
          "pitch": -0.569261126275002,
          "title": "JN-EL-6",
          "text": "TO JN-EL-5"
        },
        {
          "yaw": -2.9086384548138895,
          "pitch": -0.8126877412930149,
          "title": "AC-OPINING-END",
          "text": "IN TO AC-OPINING-2"
        },
        {
          "yaw": -0.5072197265534744,
          "pitch": -0.9195778398430487,
          "title": "AC-OPINING-2",
          "text": "AC-OPINING-END TO JN-AC"
        },
        {
          "yaw": -0.24762452227824738,
          "pitch": -0.3644624672579049,
          "title": "JN-AC",
          "text": "HVAC ROOT"
        },
        {
          "yaw": -0.18539511562335775,
          "pitch": -0.18428630113754707,
          "title": "AC-OPINING-3",
          "text": "IN TO JN-AC"
        },
        {
          "yaw": 0.1736356924605431,
          "pitch": 0.5088837322300019,
          "title": "JN-PW-3",
          "text": "JN-PW2 TO JN-PW4"
        },
        {
          "yaw": 0.9351135742345491,
          "pitch": -0.22389211365928574,
          "title": "<p>PW-Service Entre Node-3&nbsp;&nbsp;</p><p>( PW-SEN-3 )</p>",
          "text": "Plumbing System"
        },
        {
          "yaw": 0.1885085387367269,
          "pitch": 0.17052095640581655,
          "title": "JN-PW-2",
          "text": "IN TO JN-PW-3"
        },
        {
          "yaw": 0.6994954344577735,
          "pitch": 0.1303145600912714,
          "title": "FAUCET-3",
          "text": "IN TO JN-PW-2"
        },
        {
          "yaw": 1.0229307046395828,
          "pitch": 1.0782743461177855,
          "title": "JN-PW4",
          "text": "JN-PW3 TO JN-PW5"
        },
        {
          "yaw": 1.1258171970961843,
          "pitch": 0.7979521788271615,
          "title": "JN-PW5",
          "text": "JN-PW5 TO JNPE6"
        },
        {
          "yaw": 1.3849705056845103,
          "pitch": 0.15538814875188756,
          "title": "JN-PW6",
          "text": "IN TO JN-PW5"
        },
        {
          "yaw": 1.3126393729389623,
          "pitch": 0.2550246271006831,
          "title": "FAUCET-4",
          "text": "IN TO JN-PW5"
        },
        {
          "yaw": 1.6616233552871869,
          "pitch": 0.1564631073588778,
          "title": "FAUCET-5",
          "text": "IN TO JN-PW-6"
        }
      ]
    },
    {
      "id": "3-groundkichin",
      "name": "GroundKichin",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -0.5310055160591105,
          "pitch": 0.31675076134224867,
          "rotation": 0,
          "target": "2-groundhall"
        }
      ],
      "infoHotspots": [
        {
          "yaw": -0.7789678636155397,
          "pitch": 0.2040063165044934,
          "title": "SWITCH-3",
          "text": "IN&nbsp; TO JN-EL-14"
        },
        {
          "yaw": -1.0439339516028507,
          "pitch": 0.3000191929619085,
          "title": "SWITCH-4",
          "text": "JN-EL-4 TO SWITCH-5"
        },
        {
          "yaw": -1.4248554573000192,
          "pitch": 0.46463578464492095,
          "title": "SWITCH-5",
          "text": "IN TO SWITCH-4"
        },
        {
          "yaw": 2.871700169401633,
          "pitch": 0.3756472399601414,
          "title": "SWITCH-4",
          "text": "IN TO&nbsp; COFFEE MACHINE"
        },
        {
          "yaw": -2.843735009478369,
          "pitch": -0.613916194642897,
          "title": "OVEN-EL",
          "text": "IN TO JN-EL-13"
        },
        {
          "yaw": 2.259404507657356,
          "pitch": 0.38830992391356745,
          "title": "FAUCET-6",
          "text": "IN TO PW-SEN-2"
        },
        {
          "yaw": 1.7241393242528904,
          "pitch": -0.5758698328404996,
          "title": "COFFEE MACHINE",
          "text": "JN-EL13 TO SWICH-4"
        },
        {
          "yaw": 0.028245386175409948,
          "pitch": 0.7419270165263683,
          "title": "OVEN-GS",
          "text": "IN TO JS-GS-4"
        },
        {
          "yaw": 0.02946046689744719,
          "pitch": 1.0208153530178379,
          "title": "JN-GS-4",
          "text": "IN TO JN-GS-MAIN"
        },
        {
          "yaw": 0.646066643778159,
          "pitch": 1.2532716832584416,
          "title": "JN-GS-MAIN",
          "text": "IN TO GS-SEN"
        },
        {
          "yaw": 0.9617994738571767,
          "pitch": 0.6398825296304338,
          "title": "JN-GS-2",
          "text": "JN-GS-1 TO JN-GS-MAIN"
        },
        {
          "yaw": -2.0708939972763822,
          "pitch": 0.23373133966713944,
          "title": "<p>GS-Service Entre Node&nbsp;</p>\n<p>( GS-SEN )</p>",
          "text": "Gas System"
        },
        {
          "yaw": -0.725392375099517,
          "pitch": -0.29942301493093026,
          "title": "<p>EL-Service Entre Node-4&nbsp;</p><p>( EL-SEN-4 )</p>",
          "text": "Electrical System"
        },
        {
          "yaw": 3.039754779797276,
          "pitch": -0.7526847045699725,
          "title": "JN-EL-13",
          "text": "IN JN-EL-12"
        },
        {
          "yaw": -1.440660315243214,
          "pitch": -1.0742867198362962,
          "title": "JN-EL-12",
          "text": "JN-EL-11 TO JN-EL-13"
        },
        {
          "yaw": -1.3732663048176779,
          "pitch": -0.88586386255907,
          "title": "JN-EN-11",
          "text": "EL-SEN-4 TO JN-EL-12"
        },
        {
          "yaw": -0.8735225531551727,
          "pitch": 0.2129949958087458,
          "title": "JN-EL14",
          "text": "EL-SEN-4 TO SWITCH-3"
        },
        {
          "yaw": -0.7924936844697186,
          "pitch": -0.43266757964441815,
          "title": "JN-EL-15",
          "text": "IN TO EL-SEN-4"
        },
        {
          "yaw": 0.18266515469694156,
          "pitch": -0.36098153717403747,
          "title": "LIGHT-END-2",
          "text": "IN TO JN-EL-15"
        },
        {
          "yaw": 0.8924252940065784,
          "pitch": -1.1841132798325873,
          "title": "LIGHT-END",
          "text": "IN TO JN-EL-12"
        },
        {
          "yaw": 1.3490493765398455,
          "pitch": 0.1109999915346691,
          "title": "GRILL",
          "text": "IN TO JN-GS-1"
        },
        {
          "yaw": 1.3281288897769876,
          "pitch": 0.6167577545173337,
          "title": "JN-GS-1",
          "text": "IN TO JN-GS-2"
        },
        {
          "yaw": 2.295992193598515,
          "pitch": -0.19400287319995968,
          "title": "<p>PW-Service Entre Node-2</p><p>\n</p><p>( PW-SEN-2 )</p>",
          "text": "Plumbing System"
        }
      ]
    },
    {
      "id": "4-corridorground",
      "name": "CorridorGround",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "yaw": -1.429971466933928,
        "pitch": 0.12320167079951005,
        "fov": 1.504047970323865
      },
      "linkHotspots": [
        {
          "yaw": 1.8011322496688962,
          "pitch": 0.5029125246352564,
          "rotation": 0,
          "target": "5-livingroom"
        },
        {
          "yaw": -1.3740595910659366,
          "pitch": 0.4252040783454145,
          "rotation": 0,
          "target": "2-groundhall"
        },
        {
          "yaw": -1.7524441558339525,
          "pitch": 0.7914169075334545,
          "rotation": 4.71238898038469,
          "target": "3-groundkichin"
        }
      ],
      "infoHotspots": [
        {
          "yaw": -1.4307233728271207,
          "pitch": -0.3834580122226612,
          "title": "JN-EL-6",
          "text": "Electrical root"
        },
        {
          "yaw": 1.754613760689013,
          "pitch": -0.30340068583449664,
          "title": "LIGHT-END",
          "text": "IN TO JN=EL-6"
        },
        {
          "yaw": -1.7157845283674558,
          "pitch": 0.21364923920458878,
          "title": "SWITCH-6",
          "text": "IN TO JN-EL17"
        },
        {
          "yaw": -1.709252139543615,
          "pitch": -0.5142243533778306,
          "title": "JN-EL-17",
          "text": "IN TO JN-EL-6"
        },
        {
          "yaw": -1.1043267002774417,
          "pitch": 0.20466203184079568,
          "title": "SWITCH-7",
          "text": "JN-EL-18 TO SOCKET-4"
        },
        {
          "yaw": -1.0932471941440216,
          "pitch": -0.5288515482418017,
          "title": "JN=EL-18",
          "text": "IN TO JN-EL-6"
        },
        {
          "yaw": -2.9488455487244387,
          "pitch": 1.0410757773581683,
          "title": "SOCKET-3",
          "text": "IN TO JN-EL-19"
        },
        {
          "yaw": -2.691059685686078,
          "pitch": -1.050367581156161,
          "title": "JN-EL-19",
          "text": "JN-EL17 TO SOCKET-3"
        },
        {
          "yaw": -0.6356909827588808,
          "pitch": 0.9068562619680822,
          "title": "SOCKET-4",
          "text": "IN TO SWITCH-7"
        }
      ]
    },
    {
      "id": "5-livingroom",
      "name": "LivingRoom",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2048,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 2.0439251495813444,
          "pitch": 0.5705904602115464,
          "rotation": 0,
          "target": "4-corridorground"
        }
      ],
      "infoHotspots": [
        {
          "yaw": 0.7344470329859423,
          "pitch": 0.21736948812307233,
          "title": "JN-EL-19",
          "text": "IN TO JN-EL-20"
        },
        {
          "yaw": 0.706243689061246,
          "pitch": 0.5274702721592153,
          "title": "SOCKET-5",
          "text": "IN TO JN-EL-19"
        },
        {
          "yaw": 1.0518886374622003,
          "pitch": 0.40285183090831467,
          "title": "SWITCH-8",
          "text": "IN TO JN-EL-19"
        },
        {
          "yaw": 0.49183969641716274,
          "pitch": -0.695563288399196,
          "title": "<p>EL-Service Entre Node-5</p>\n<p>( EL-SEN-5 )</p>",
          "text": "Text"
        },
        {
          "yaw": -0.2558780634381126,
          "pitch": -0.7843628622062457,
          "title": "LIGHT-END-1",
          "text": "IN TO EL-SEN-5"
        },
        {
          "yaw": 0.6206089766606855,
          "pitch": -0.8931918477231804,
          "title": "JN-EL-20",
          "text": "EL=SEN-5 TO JN-EL-19"
        }
      ]
    }
  ],
  "name": "Project Title",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": true,
    "fullscreenButton": false,
    "viewControlButtons": false
  }
};
