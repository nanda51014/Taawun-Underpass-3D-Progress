/* Taawun Underpass 3D Progress Model - export the 3D model with current statuses to DXF (AutoCAD 2000 format).
 *
 * Opens in AutoCAD / Civil 3D / BricsCAD / CADmate (GstarCAD); use Save As > DWG there.
 * - Units: metres. CAD X = chainage, CAD Y + = LHS (facing Sharjah), CAD Z = level relative to top of wall (0.00).
 * - MODEL-OUTLINE: the 3D model as lines (feature edges only).
 * - One HATCH-<ACTIVITY> layer per activity type. Every face of an element is hatched on the layer of each of its
 *   activities by that activity's status: SOLID = complete, ANSI31 diagonal = in progress,
 *   ANSI37 cross-hatch in red = on hold, no hatch = not started.
 *   Base / wall / top-slab waterproofing share HATCH-WATERPROOFING.
 * Loaded after the model script; adds an "Export DXF (CAD)" button to the bottom-left tools.
 */
(function () {
  'use strict';
  if (typeof allMeshes === 'undefined' || typeof EL === 'undefined') return;
  // AutoCAD 2000 skeleton generated with ezdxf: header, all tables (layers below pre-defined), blocks, objects.
  var TPL = "0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1015\n9\n$ACADMAINTVER\n70\n6\n9\n$DWGCODEPAGE\n3\nANSI_1252\n9\n$INSBASE\n10\n0.0\n20\n0.0\n30\n0.0\n9\n$EXTMIN\n10\n@@EXTMIN_X@@\n20\n@@EXTMIN_Y@@\n30\n@@EXTMIN_Z@@\n9\n$EXTMAX\n10\n@@EXTMAX_X@@\n20\n@@EXTMAX_Y@@\n30\n@@EXTMAX_Z@@\n9\n$LIMMIN\n10\n@@LIMMIN_X@@\n20\n@@LIMMIN_Y@@\n9\n$LIMMAX\n10\n@@LIMMAX_X@@\n20\n@@LIMMAX_Y@@\n9\n$ORTHOMODE\n70\n0\n9\n$REGENMODE\n70\n1\n9\n$FILLMODE\n70\n1\n9\n$QTEXTMODE\n70\n0\n9\n$MIRRTEXT\n70\n1\n9\n$LTSCALE\n40\n1.0\n9\n$ATTMODE\n70\n1\n9\n$TEXTSIZE\n40\n2.5\n9\n$TRACEWID\n40\n1.0\n9\n$TEXTSTYLE\n7\nStandard\n9\n$CLAYER\n8\n0\n9\n$CELTYPE\n6\nByLayer\n9\n$CECOLOR\n62\n256\n9\n$CELTSCALE\n40\n1.0\n9\n$DISPSILH\n70\n0\n9\n$DIMSCALE\n40\n1.0\n9\n$DIMASZ\n40\n2.5\n9\n$DIMEXO\n40\n0.625\n9\n$DIMDLI\n40\n3.75\n9\n$DIMRND\n40\n0.0\n9\n$DIMDLE\n40\n0.0\n9\n$DIMEXE\n40\n1.25\n9\n$DIMTP\n40\n0.0\n9\n$DIMTM\n40\n0.0\n9\n$DIMTXT\n40\n2.5\n9\n$DIMCEN\n40\n2.5\n9\n$DIMTSZ\n40\n0.0\n9\n$DIMTOL\n70\n0\n9\n$DIMLIM\n70\n0\n9\n$DIMTIH\n70\n0\n9\n$DIMTOH\n70\n0\n9\n$DIMSE1\n70\n0\n9\n$DIMSE2\n70\n0\n9\n$DIMTAD\n70\n1\n9\n$DIMZIN\n70\n8\n9\n$DIMBLK\n1\n\n9\n$DIMASO\n70\n1\n9\n$DIMSHO\n70\n1\n9\n$DIMPOST\n1\n\n9\n$DIMAPOST\n1\n\n9\n$DIMALT\n70\n0\n9\n$DIMALTD\n70\n3\n9\n$DIMALTF\n40\n0.03937007874\n9\n$DIMLFAC\n40\n1.0\n9\n$DIMTOFL\n70\n1\n9\n$DIMTVP\n40\n0.0\n9\n$DIMTIX\n70\n0\n9\n$DIMSOXD\n70\n0\n9\n$DIMSAH\n70\n0\n9\n$DIMBLK1\n1\n\n9\n$DIMBLK2\n1\n\n9\n$DIMSTYLE\n2\nISO-25\n9\n$DIMCLRD\n70\n0\n9\n$DIMCLRE\n70\n0\n9\n$DIMCLRT\n70\n0\n9\n$DIMTFAC\n40\n1.0\n9\n$DIMGAP\n40\n0.625\n9\n$DIMJUST\n70\n0\n9\n$DIMSD1\n70\n0\n9\n$DIMSD2\n70\n0\n9\n$DIMTOLJ\n70\n0\n9\n$DIMTZIN\n70\n8\n9\n$DIMALTZ\n70\n0\n9\n$DIMALTTZ\n70\n0\n9\n$DIMUPT\n70\n0\n9\n$DIMDEC\n70\n2\n9\n$DIMTDEC\n70\n2\n9\n$DIMALTU\n70\n2\n9\n$DIMALTTD\n70\n3\n9\n$DIMTXSTY\n7\nStandard\n9\n$DIMAUNIT\n70\n0\n9\n$DIMADEC\n70\n0\n9\n$DIMALTRND\n40\n0.0\n9\n$DIMAZIN\n70\n0\n9\n$DIMDSEP\n70\n44\n9\n$DIMATFIT\n70\n3\n9\n$DIMFRAC\n70\n0\n9\n$DIMLDRBLK\n1\n\n9\n$DIMLUNIT\n70\n2\n9\n$DIMLWD\n70\n-2\n9\n$DIMLWE\n70\n-2\n9\n$DIMTMOVE\n70\n0\n9\n$LUNITS\n70\n2\n9\n$LUPREC\n70\n3\n9\n$SKETCHINC\n40\n1.0\n9\n$FILLETRAD\n40\n10.0\n9\n$AUNITS\n70\n0\n9\n$AUPREC\n70\n2\n9\n$MENU\n1\n.\n9\n$ELEVATION\n40\n0.0\n9\n$PELEVATION\n40\n0.0\n9\n$THICKNESS\n40\n0.0\n9\n$LIMCHECK\n70\n0\n9\n$CHAMFERA\n40\n0.0\n9\n$CHAMFERB\n40\n0.0\n9\n$CHAMFERC\n40\n0.0\n9\n$CHAMFERD\n40\n0.0\n9\n$SKPOLY\n70\n0\n9\n$TDCREATE\n40\n2461355.4519560183\n9\n$TDUCREATE\n40\n2458532.153996898\n9\n$TDUPDATE\n40\n2461355.4519560183\n9\n$TDUUPDATE\n40\n2458532.1544311\n9\n$TDINDWG\n40\n0.0\n9\n$TDUSRTIMER\n40\n0.0\n9\n$USRTIMER\n70\n1\n9\n$ANGBASE\n50\n0.0\n9\n$ANGDIR\n70\n0\n9\n$PDMODE\n70\n0\n9\n$PDSIZE\n40\n0.0\n9\n$PLINEWID\n40\n0.0\n9\n$SPLFRAME\n70\n0\n9\n$SPLINETYPE\n70\n6\n9\n$SPLINESEGS\n70\n8\n9\n$HANDSEED\n5\n@@HANDSEED@@\n9\n$SURFTAB1\n70\n6\n9\n$SURFTAB2\n70\n6\n9\n$SURFTYPE\n70\n6\n9\n$SURFU\n70\n6\n9\n$SURFV\n70\n6\n9\n$UCSBASE\n2\n\n9\n$UCSNAME\n2\n\n9\n$UCSORG\n10\n0.0\n20\n0.0\n30\n0.0\n9\n$UCSXDIR\n10\n1.0\n20\n0.0\n30\n0.0\n9\n$UCSYDIR\n10\n0.0\n20\n1.0\n30\n0.0\n9\n$UCSORTHOREF\n2\n\n9\n$UCSORTHOVIEW\n70\n0\n9\n$UCSORGTOP\n10\n0.0\n20\n0.0\n30\n0.0\n9\n$UCSORGBOTTOM\n10\n0.0\n20\n0.0\n30\n0.0\n9\n$UCSORGLEFT\n10\n0.0\n20\n0.0\n30\n0.0\n9\n$UCSORGRIGHT\n10\n0.0\n20\n0.0\n30\n0.0\n9\n$UCSORGFRONT\n10\n0.0\n20\n0.0\n30\n0.0\n9\n$UCSORGBACK\n10\n0.0\n20\n0.0\n30\n0.0\n9\n$PUCSBASE\n2\n\n9\n$PUCSNAME\n2\n\n9\n$PUCSORG\n10\n0.0\n20\n0.0\n30\n0.0\n9\n$PUCSXDIR\n10\n1.0\n20\n0.0\n30\n0.0\n9\n$PUCSYDIR\n10\n0.0\n20\n1.0\n30\n0.0\n9\n$PUCSORTHOREF\n2\n\n9\n$PUCSORTHOVIEW\n70\n0\n9\n$PUCSORGTOP\n10\n0.0\n20\n0.0\n30\n0.0\n9\n$PUCSORGBOTTOM\n10\n0.0\n20\n0.0\n30\n0.0\n9\n$PUCSORGLEFT\n10\n0.0\n20\n0.0\n30\n0.0\n9\n$PUCSORGRIGHT\n10\n0.0\n20\n0.0\n30\n0.0\n9\n$PUCSORGFRONT\n10\n0.0\n20\n0.0\n30\n0.0\n9\n$PUCSORGBACK\n10\n0.0\n20\n0.0\n30\n0.0\n9\n$USERI1\n70\n0\n9\n$USERI2\n70\n0\n9\n$USERI3\n70\n0\n9\n$USERI4\n70\n0\n9\n$USERI5\n70\n0\n9\n$USERR1\n40\n0.0\n9\n$USERR2\n40\n0.0\n9\n$USERR3\n40\n0.0\n9\n$USERR4\n40\n0.0\n9\n$USERR5\n40\n0.0\n9\n$WORLDVIEW\n70\n1\n9\n$SHADEDGE\n70\n3\n9\n$SHADEDIF\n70\n70\n9\n$TILEMODE\n70\n1\n9\n$MAXACTVP\n70\n64\n9\n$PINSBASE\n10\n0.0\n20\n0.0\n30\n0.0\n9\n$PLIMCHECK\n70\n0\n9\n$PEXTMIN\n10\n1e+20\n20\n1e+20\n30\n1e+20\n9\n$PEXTMAX\n10\n-1e+20\n20\n-1e+20\n30\n-1e+20\n9\n$PLIMMIN\n10\n0.0\n20\n0.0\n9\n$PLIMMAX\n10\n420.0\n20\n297.0\n9\n$UNITMODE\n70\n0\n9\n$VISRETAIN\n70\n1\n9\n$PLINEGEN\n70\n0\n9\n$PSLTSCALE\n70\n1\n9\n$TREEDEPTH\n70\n3020\n9\n$CMLSTYLE\n2\nStandard\n9\n$CMLJUST\n70\n0\n9\n$CMLSCALE\n40\n20.0\n9\n$PROXYGRAPHICS\n70\n1\n9\n$MEASUREMENT\n70\n1\n9\n$CELWEIGHT\n370\n-1\n9\n$ENDCAPS\n280\n0\n9\n$JOINSTYLE\n280\n0\n9\n$LWDISPLAY\n290\n0\n9\n$INSUNITS\n70\n6\n9\n$HYPERLINKBASE\n1\n\n9\n$STYLESHEET\n1\n\n9\n$XEDIT\n290\n1\n9\n$CEPSNTYPE\n380\n0\n9\n$PSTYLEMODE\n290\n1\n9\n$FINGERPRINTGUID\n2\n{6FF5AA11-E557-44A6-A058-621A93516671}\n9\n$VERSIONGUID\n2\n{B10BA57B-FC01-4667-A08F-6886C6CA6815}\n9\n$EXTNAMES\n290\n1\n9\n$PSVPSCALE\n40\n0.0\n9\n$OLESTARTUP\n290\n0\n0\nENDSEC\n0\nSECTION\n2\nCLASSES\n0\nCLASS\n1\nACDBDICTIONARYWDFLT\n2\nAcDbDictionaryWithDefault\n3\nObjectDBX Classes\n90\n0\n280\n0\n281\n0\n0\nCLASS\n1\nSUN\n2\nAcDbSun\n3\nSCENEOE\n90\n1153\n280\n0\n281\n0\n0\nCLASS\n1\nVISUALSTYLE\n2\nAcDbVisualStyle\n3\nObjectDBX Classes\n90\n4095\n280\n0\n281\n0\n0\nCLASS\n1\nMATERIAL\n2\nAcDbMaterial\n3\nObjectDBX Classes\n90\n1153\n280\n0\n281\n0\n0\nCLASS\n1\nSCALE\n2\nAcDbScale\n3\nObjectDBX Classes\n90\n1153\n280\n0\n281\n0\n0\nCLASS\n1\nTABLESTYLE\n2\nAcDbTableStyle\n3\nObjectDBX Classes\n90\n4095\n280\n0\n281\n0\n0\nCLASS\n1\nMLEADERSTYLE\n2\nAcDbMLeaderStyle\n3\nACDB_MLEADERSTYLE_CLASS\n90\n4095\n280\n0\n281\n0\n0\nCLASS\n1\nDICTIONARYVAR\n2\nAcDbDictionaryVar\n3\nObjectDBX Classes\n90\n0\n280\n0\n281\n0\n0\nCLASS\n1\nCELLSTYLEMAP\n2\nAcDbCellStyleMap\n3\nObjectDBX Classes\n90\n1152\n280\n0\n281\n0\n0\nCLASS\n1\nMENTALRAYRENDERSETTINGS\n2\nAcDbMentalRayRenderSettings\n3\nSCENEOE\n90\n1024\n280\n0\n281\n0\n0\nCLASS\n1\nACDBDETAILVIEWSTYLE\n2\nAcDbDetailViewStyle\n3\nObjectDBX Classes\n90\n1025\n280\n0\n281\n0\n0\nCLASS\n1\nACDBSECTIONVIEWSTYLE\n2\nAcDbSectionViewStyle\n3\nObjectDBX Classes\n90\n1025\n280\n0\n281\n0\n0\nCLASS\n1\nRASTERVARIABLES\n2\nAcDbRasterVariables\n3\nISM\n90\n0\n280\n0\n281\n0\n0\nCLASS\n1\nACDBPLACEHOLDER\n2\nAcDbPlaceHolder\n3\nObjectDBX Classes\n90\n0\n280\n0\n281\n0\n0\nCLASS\n1\nLAYOUT\n2\nAcDbLayout\n3\nObjectDBX Classes\n90\n0\n280\n0\n281\n0\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nVPORT\n5\n8\n330\n0\n100\nAcDbSymbolTable\n70\n1\n0\nVPORT\n5\n23\n330\n8\n100\nAcDbSymbolTableRecord\n100\nAcDbViewportTableRecord\n2\n*Active\n70\n0\n10\n0.0\n20\n0.0\n11\n1.0\n21\n1.0\n12\n@@VC_X@@\n22\n@@VC_Y@@\n13\n0.0\n23\n0.0\n14\n0.5\n24\n0.5\n15\n0.5\n25\n0.5\n16\n0.0\n26\n0.0\n36\n1.0\n17\n0.0\n27\n0.0\n37\n0.0\n40\n@@VH@@\n41\n2.5\n42\n50.0\n43\n0.0\n44\n0.0\n50\n0.0\n51\n0.0\n71\n0\n72\n1000\n73\n1\n74\n3\n75\n0\n76\n0\n77\n0\n78\n0\n281\n0\n65\n0\n146\n0.0\n0\nENDTAB\n0\nTABLE\n2\nLTYPE\n5\n2\n330\n0\n100\nAcDbSymbolTable\n70\n3\n0\nLTYPE\n5\n24\n330\n2\n100\nAcDbSymbolTableRecord\n100\nAcDbLinetypeTableRecord\n2\nByBlock\n70\n0\n3\n\n72\n65\n73\n0\n40\n0.0\n0\nLTYPE\n5\n25\n330\n2\n100\nAcDbSymbolTableRecord\n100\nAcDbLinetypeTableRecord\n2\nByLayer\n70\n0\n3\n\n72\n65\n73\n0\n40\n0.0\n0\nLTYPE\n5\n26\n330\n2\n100\nAcDbSymbolTableRecord\n100\nAcDbLinetypeTableRecord\n2\nContinuous\n70\n0\n3\n\n72\n65\n73\n0\n40\n0.0\n0\nENDTAB\n0\nTABLE\n2\nLAYER\n5\n1\n330\n0\n100\nAcDbSymbolTable\n70\n18\n0\nLAYER\n5\n27\n330\n1\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n2\n0\n70\n0\n62\n7\n6\nContinuous\n370\n-3\n390\n13\n0\nLAYER\n5\n28\n330\n1\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n2\nDefpoints\n70\n0\n62\n7\n6\nContinuous\n290\n0\n370\n-3\n390\n13\n0\nLAYER\n5\n2F\n330\n1\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n2\nMODEL-OUTLINE\n70\n0\n62\n7\n6\nContinuous\n370\n-3\n390\n13\n0\nLAYER\n5\n30\n330\n1\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n2\nHATCH-EXCAVATION-SHORING\n70\n0\n62\n42\n6\nContinuous\n370\n-3\n390\n13\n0\nLAYER\n5\n31\n330\n1\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n2\nHATCH-GRANULAR-FILL\n70\n0\n62\n52\n6\nContinuous\n370\n-3\n390\n13\n0\nLAYER\n5\n32\n330\n1\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n2\nHATCH-BLINDING\n70\n0\n62\n8\n6\nContinuous\n370\n-3\n390\n13\n0\nLAYER\n5\n33\n330\n1\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n2\nHATCH-WATERPROOFING\n70\n0\n62\n5\n6\nContinuous\n370\n-3\n390\n13\n0\nLAYER\n5\n34\n330\n1\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n2\nHATCH-MASS-CONCRETE\n70\n0\n62\n94\n6\nContinuous\n370\n-3\n390\n13\n0\nLAYER\n5\n35\n330\n1\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n2\nHATCH-REINFORCEMENT\n70\n0\n62\n2\n6\nContinuous\n370\n-3\n390\n13\n0\nLAYER\n5\n36\n330\n1\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n2\nHATCH-FORMWORK\n70\n0\n62\n30\n6\nContinuous\n370\n-3\n390\n13\n0\nLAYER\n5\n37\n330\n1\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n2\nHATCH-CONCRETE\n70\n0\n62\n3\n6\nContinuous\n370\n-3\n390\n13\n0\nLAYER\n5\n38\n330\n1\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n2\nHATCH-BACKFILL\n70\n0\n62\n34\n6\nContinuous\n370\n-3\n390\n13\n0\nLAYER\n5\n39\n330\n1\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n2\nHATCH-TILING\n70\n0\n62\n6\n6\nContinuous\n370\n-3\n390\n13\n0\nLAYER\n5\n3A\n330\n1\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n2\nHATCH-WEARING-SURFACE\n70\n0\n62\n140\n6\nContinuous\n370\n-3\n390\n13\n0\nLAYER\n5\n3B\n330\n1\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n2\nTXT-SEGMENT\n70\n0\n62\n7\n6\nContinuous\n370\n-3\n390\n13\n0\nLAYER\n5\n3C\n330\n1\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n2\nTXT-CHAINAGE\n70\n0\n62\n8\n6\nContinuous\n370\n-3\n390\n13\n0\nLAYER\n5\n3D\n330\n1\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n2\nTXT-TITLE\n70\n0\n62\n7\n6\nContinuous\n370\n-3\n390\n13\n0\nLAYER\n5\n3E\n330\n1\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n2\nTXT-LEGEND\n70\n0\n62\n7\n6\nContinuous\n370\n-3\n390\n13\n0\nENDTAB\n0\nTABLE\n2\nSTYLE\n5\n5\n330\n0\n100\nAcDbSymbolTable\n70\n1\n0\nSTYLE\n5\n29\n330\n5\n100\nAcDbSymbolTableRecord\n100\nAcDbTextStyleTableRecord\n2\nStandard\n70\n0\n40\n0.0\n41\n1.0\n50\n0.0\n71\n0\n42\n2.5\n3\ntxt\n4\n\n0\nENDTAB\n0\nTABLE\n2\nVIEW\n5\n7\n330\n0\n100\nAcDbSymbolTable\n70\n0\n0\nENDTAB\n0\nTABLE\n2\nUCS\n5\n6\n330\n0\n100\nAcDbSymbolTable\n70\n0\n0\nENDTAB\n0\nTABLE\n2\nAPPID\n5\n3\n330\n0\n100\nAcDbSymbolTable\n70\n3\n0\nAPPID\n5\n2A\n330\n3\n100\nAcDbSymbolTableRecord\n100\nAcDbRegAppTableRecord\n2\nACAD\n70\n0\n0\nAPPID\n5\n3F\n330\n3\n100\nAcDbSymbolTableRecord\n100\nAcDbRegAppTableRecord\n2\nHATCHBACKGROUNDCOLOR\n70\n0\n0\nAPPID\n5\n40\n330\n3\n100\nAcDbSymbolTableRecord\n100\nAcDbRegAppTableRecord\n2\nEZDXF\n70\n0\n0\nENDTAB\n0\nTABLE\n2\nDIMSTYLE\n5\n4\n330\n0\n100\nAcDbSymbolTable\n70\n1\n100\nAcDbDimStyleTable\n0\nDIMSTYLE\n105\n2B\n330\n4\n100\nAcDbSymbolTableRecord\n100\nAcDbDimStyleTableRecord\n2\nStandard\n70\n0\n3\n\n4\n\n40\n1.0\n41\n2.5\n42\n0.625\n43\n3.75\n44\n1.25\n45\n0.0\n46\n0.0\n47\n0.0\n48\n0.0\n140\n2.5\n141\n2.5\n142\n0.0\n143\n0.03937007874\n144\n1.0\n145\n0.0\n146\n1.0\n147\n0.625\n148\n0.0\n71\n0\n72\n0\n73\n0\n74\n0\n75\n0\n76\n0\n77\n1\n78\n8\n79\n3\n170\n0\n171\n3\n172\n1\n173\n0\n174\n0\n175\n0\n176\n0\n177\n0\n178\n0\n179\n2\n271\n2\n272\n2\n273\n2\n274\n3\n275\n0\n276\n0\n277\n2\n278\n44\n279\n0\n280\n0\n281\n0\n282\n0\n283\n0\n284\n8\n285\n0\n286\n0\n288\n0\n289\n3\n371\n-2\n372\n-2\n0\nENDTAB\n0\nTABLE\n2\nBLOCK_RECORD\n5\n9\n330\n0\n100\nAcDbSymbolTable\n70\n2\n0\nBLOCK_RECORD\n5\n17\n330\n9\n100\nAcDbSymbolTableRecord\n100\nAcDbBlockTableRecord\n2\n*Model_Space\n340\n1A\n0\nBLOCK_RECORD\n5\n1B\n330\n9\n100\nAcDbSymbolTableRecord\n100\nAcDbBlockTableRecord\n2\n*Paper_Space\n340\n1E\n0\nENDTAB\n0\nENDSEC\n0\nSECTION\n2\nBLOCKS\n0\nBLOCK\n5\n18\n330\n17\n100\nAcDbEntity\n8\n0\n100\nAcDbBlockBegin\n2\n*Model_Space\n70\n0\n10\n0.0\n20\n0.0\n30\n0.0\n3\n*Model_Space\n1\n\n0\nENDBLK\n5\n19\n330\n17\n100\nAcDbEntity\n8\n0\n100\nAcDbBlockEnd\n0\nBLOCK\n5\n1C\n330\n1B\n100\nAcDbEntity\n8\n0\n100\nAcDbBlockBegin\n2\n*Paper_Space\n70\n0\n10\n0.0\n20\n0.0\n30\n0.0\n3\n*Paper_Space\n1\n\n0\nENDBLK\n5\n1D\n330\n1B\n100\nAcDbEntity\n8\n0\n100\nAcDbBlockEnd\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n@@ENTITIES@@\n0\nENDSEC\n0\nSECTION\n2\nOBJECTS\n0\nDICTIONARY\n5\nA\n330\n0\n100\nAcDbDictionary\n281\n1\n3\nACAD_COLOR\n350\nB\n3\nACAD_GROUP\n350\nC\n3\nACAD_LAYOUT\n350\nD\n3\nACAD_MATERIAL\n350\nE\n3\nACAD_MLEADERSTYLE\n350\nF\n3\nACAD_MLINESTYLE\n350\n10\n3\nACAD_PLOTSETTINGS\n350\n11\n3\nACAD_PLOTSTYLENAME\n350\n12\n3\nACAD_SCALELIST\n350\n14\n3\nACAD_TABLESTYLE\n350\n15\n3\nACAD_VISUALSTYLE\n350\n16\n3\nEZDXF_META\n350\n2D\n0\nDICTIONARY\n5\nB\n330\nA\n100\nAcDbDictionary\n281\n1\n0\nDICTIONARY\n5\nC\n330\nA\n100\nAcDbDictionary\n281\n1\n0\nDICTIONARY\n5\nD\n330\nA\n100\nAcDbDictionary\n281\n1\n3\nModel\n350\n1A\n3\nLayout1\n350\n1E\n0\nDICTIONARY\n5\nE\n330\nA\n100\nAcDbDictionary\n281\n1\n3\nByBlock\n350\n1F\n3\nByLayer\n350\n20\n3\nGlobal\n350\n21\n0\nDICTIONARY\n5\nF\n330\nA\n100\nAcDbDictionary\n281\n1\n3\nStandard\n350\n2C\n0\nDICTIONARY\n5\n10\n330\nA\n100\nAcDbDictionary\n281\n1\n3\nStandard\n350\n22\n0\nDICTIONARY\n5\n11\n330\nA\n100\nAcDbDictionary\n281\n1\n0\nACDBDICTIONARYWDFLT\n5\n12\n330\nA\n100\nAcDbDictionary\n281\n1\n3\nNormal\n350\n13\n100\nAcDbDictionaryWithDefault\n340\n13\n0\nACDBPLACEHOLDER\n5\n13\n330\n12\n0\nDICTIONARY\n5\n14\n330\nA\n100\nAcDbDictionary\n281\n1\n0\nDICTIONARY\n5\n15\n330\nA\n100\nAcDbDictionary\n281\n1\n0\nDICTIONARY\n5\n16\n330\nA\n100\nAcDbDictionary\n281\n1\n0\nLAYOUT\n5\n1A\n330\nD\n100\nAcDbPlotSettings\n1\n\n4\nA3\n6\n\n40\n7.5\n41\n20.0\n42\n7.5\n43\n20.0\n44\n420.0\n45\n297.0\n46\n0.0\n47\n0.0\n48\n0.0\n49\n0.0\n140\n0.0\n141\n0.0\n142\n1.0\n143\n1.0\n70\n1024\n72\n1\n73\n0\n74\n5\n7\n\n75\n16\n76\n0\n77\n2\n78\n300\n147\n1.0\n148\n0.0\n149\n0.0\n100\nAcDbLayout\n1\nModel\n70\n1\n71\n0\n10\n0.0\n20\n0.0\n11\n420.0\n21\n297.0\n12\n0.0\n22\n0.0\n32\n0.0\n14\n1e+20\n24\n1e+20\n34\n1e+20\n15\n-1e+20\n25\n-1e+20\n35\n-1e+20\n146\n0.0\n13\n0.0\n23\n0.0\n33\n0.0\n16\n1.0\n26\n0.0\n36\n0.0\n17\n0.0\n27\n1.0\n37\n0.0\n76\n1\n330\n17\n0\nLAYOUT\n5\n1E\n330\nD\n100\nAcDbPlotSettings\n1\n\n4\nA3\n6\n\n40\n7.5\n41\n20.0\n42\n7.5\n43\n20.0\n44\n420.0\n45\n297.0\n46\n0.0\n47\n0.0\n48\n0.0\n49\n0.0\n140\n0.0\n141\n0.0\n142\n1.0\n143\n1.0\n70\n0\n72\n1\n73\n0\n74\n5\n7\n\n75\n16\n76\n0\n77\n2\n78\n300\n147\n1.0\n148\n0.0\n149\n0.0\n100\nAcDbLayout\n1\nLayout1\n70\n1\n71\n1\n10\n0.0\n20\n0.0\n11\n420.0\n21\n297.0\n12\n0.0\n22\n0.0\n32\n0.0\n14\n1e+20\n24\n1e+20\n34\n1e+20\n15\n-1e+20\n25\n-1e+20\n35\n-1e+20\n146\n0.0\n13\n0.0\n23\n0.0\n33\n0.0\n16\n1.0\n26\n0.0\n36\n0.0\n17\n0.0\n27\n1.0\n37\n0.0\n76\n1\n330\n1B\n0\nMATERIAL\n5\n1F\n102\n{ACAD_REACTORS\n330\nE\n102\n}\n330\nE\n100\nAcDbMaterial\n1\nByBlock\n2\n\n70\n0\n40\n1.0\n71\n1\n41\n1.0\n91\n-1023410177\n42\n1.0\n72\n1\n3\n\n73\n1\n74\n1\n75\n1\n44\n0.5\n73\n0\n45\n1.0\n46\n1.0\n77\n1\n4\n\n78\n1\n79\n1\n170\n1\n48\n1.0\n171\n1\n6\n\n172\n1\n173\n1\n174\n1\n140\n1.0\n141\n1.0\n175\n1\n7\n\n176\n1\n177\n1\n178\n1\n143\n1.0\n179\n1\n8\n\n270\n1\n271\n1\n272\n1\n145\n1.0\n146\n1.0\n273\n1\n9\n\n274\n1\n275\n1\n276\n1\n42\n1.0\n72\n1\n3\n\n73\n1\n74\n1\n75\n1\n94\n63\n0\nMATERIAL\n5\n20\n102\n{ACAD_REACTORS\n330\nE\n102\n}\n330\nE\n100\nAcDbMaterial\n1\nByLayer\n2\n\n70\n0\n40\n1.0\n71\n1\n41\n1.0\n91\n-1023410177\n42\n1.0\n72\n1\n3\n\n73\n1\n74\n1\n75\n1\n44\n0.5\n73\n0\n45\n1.0\n46\n1.0\n77\n1\n4\n\n78\n1\n79\n1\n170\n1\n48\n1.0\n171\n1\n6\n\n172\n1\n173\n1\n174\n1\n140\n1.0\n141\n1.0\n175\n1\n7\n\n176\n1\n177\n1\n178\n1\n143\n1.0\n179\n1\n8\n\n270\n1\n271\n1\n272\n1\n145\n1.0\n146\n1.0\n273\n1\n9\n\n274\n1\n275\n1\n276\n1\n42\n1.0\n72\n1\n3\n\n73\n1\n74\n1\n75\n1\n94\n63\n0\nMATERIAL\n5\n21\n102\n{ACAD_REACTORS\n330\nE\n102\n}\n330\nE\n100\nAcDbMaterial\n1\nGlobal\n2\n\n70\n0\n40\n1.0\n71\n1\n41\n1.0\n91\n-1023410177\n42\n1.0\n72\n1\n3\n\n73\n1\n74\n1\n75\n1\n44\n0.5\n73\n0\n45\n1.0\n46\n1.0\n77\n1\n4\n\n78\n1\n79\n1\n170\n1\n48\n1.0\n171\n1\n6\n\n172\n1\n173\n1\n174\n1\n140\n1.0\n141\n1.0\n175\n1\n7\n\n176\n1\n177\n1\n178\n1\n143\n1.0\n179\n1\n8\n\n270\n1\n271\n1\n272\n1\n145\n1.0\n146\n1.0\n273\n1\n9\n\n274\n1\n275\n1\n276\n1\n42\n1.0\n72\n1\n3\n\n73\n1\n74\n1\n75\n1\n94\n63\n0\nMLINESTYLE\n5\n22\n102\n{ACAD_REACTORS\n330\n10\n102\n}\n330\n10\n100\nAcDbMlineStyle\n2\nStandard\n70\n0\n3\n\n62\n256\n51\n90.0\n52\n90.0\n71\n2\n49\n0.5\n62\n256\n6\nBYLAYER\n49\n-0.5\n62\n256\n6\nBYLAYER\n0\nMLEADERSTYLE\n5\n2C\n102\n{ACAD_REACTORS\n330\nF\n102\n}\n330\nF\n100\nAcDbMLeaderStyle\n179\n2\n170\n2\n171\n1\n172\n0\n90\n2\n40\n0.0\n41\n0.0\n173\n1\n91\n-1056964608\n92\n-2\n290\n1\n42\n2.0\n291\n1\n43\n8.0\n3\nStandard\n44\n4.0\n300\n\n342\n29\n174\n1\n175\n1\n176\n0\n178\n1\n93\n-1056964608\n45\n4.0\n292\n0\n297\n0\n46\n4.0\n94\n-1056964608\n47\n1.0\n49\n1.0\n140\n1.0\n294\n1\n141\n0.0\n177\n0\n142\n1.0\n295\n0\n296\n0\n143\n3.75\n271\n0\n272\n9\n273\n9\n0\nDICTIONARY\n5\n2D\n330\nA\n100\nAcDbDictionary\n280\n1\n281\n1\n3\nCREATED_BY_EZDXF\n350\n2E\n3\nWRITTEN_BY_EZDXF\n350\n41\n0\nDICTIONARYVAR\n5\n2E\n330\n2D\n100\nDictionaryVariables\n280\n0\n1\n1.4.5 @ 2026-11-10T10:50:49.112224+00:00\n0\nDICTIONARYVAR\n5\n41\n330\n2D\n100\nDictionaryVariables\n280\n0\n1\n1.4.5 @ 2026-11-10T10:50:49.113649+00:00\n0\nENDSEC\n0\nEOF\n";
  var OWNER = '17'; // *Model_Space block record handle in TPL
  var HANDSEED0 = 0x42;

  var ACT_LAYER = { EXC: 'HATCH-EXCAVATION-SHORING', GRF: 'HATCH-GRANULAR-FILL', BLD: 'HATCH-BLINDING', WPB: 'HATCH-WATERPROOFING',
    WPW: 'HATCH-WATERPROOFING', WPT: 'HATCH-WATERPROOFING', MSC: 'HATCH-MASS-CONCRETE', RFT: 'HATCH-REINFORCEMENT', FW: 'HATCH-FORMWORK',
    CON: 'HATCH-CONCRETE', BKF: 'HATCH-BACKFILL', TIL: 'HATCH-TILING', PAV: 'HATCH-WEARING-SURFACE' };
  var LAYER_ACI = { 'HATCH-EXCAVATION-SHORING': 42, 'HATCH-GRANULAR-FILL': 52, 'HATCH-BLINDING': 8, 'HATCH-WATERPROOFING': 5,
    'HATCH-MASS-CONCRETE': 94, 'HATCH-REINFORCEMENT': 2, 'HATCH-FORMWORK': 30, 'HATCH-CONCRETE': 3, 'HATCH-BACKFILL': 34,
    'HATCH-TILING': 6, 'HATCH-WEARING-SURFACE': 140 };
  var SPACING = 0.4;                 // hatch line spacing in metres
  var ISO_ANSI = 3.175;              // ANSI31/37 spacing in acadiso.pat at scale 1
  var COS_FLAT = Math.cos(25 * Math.PI / 180);

  function n4(v) { var r = Math.round(v * 10000) / 10000; return (r === 0 ? 0 : r).toString(); }
  function vkey(p) { return n4(p[0]) + ',' + n4(p[1]) + ',' + n4(p[2]); }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function unit(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function ocsAxes(n) { // AutoCAD arbitrary axis algorithm
    var ax = (Math.abs(n[0]) < 1 / 64 && Math.abs(n[1]) < 1 / 64) ? cross([0, 1, 0], n) : cross([0, 0, 1], n);
    ax = unit(ax); return [ax, unit(cross(n, ax))];
  }
  // aggregate statuses of the activities that share one layer on one element
  function aggStatus(list) {
    if (list.some(function (s) { return s === 'HD'; })) return 'HD';
    if (list.every(function (s) { return s === 'CO'; })) return 'CO';
    if (list.some(function (s) { return s === 'IP' || s === 'CO'; })) return 'IP';
    return 'NS';
  }

  function buildDxf() {
    var ents = [], hcount = 0, lines = 0;
    var ext = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
    var grow = function (p) { for (var k = 0; k < 3; k++) { if (p[k] < ext[k]) ext[k] = p[k]; if (p[k] > ext[k + 3]) ext[k + 3] = p[k]; } };
    var v = new THREE.Vector3(), seenEdge = {};

    // ---- per mesh: triangles in CAD coords, feature-edge lines, planar face groups ----
    var meshFaces = {}; // element id -> [ {n, z, paths:[[ [x,y],... ]]} ]
    allMeshes.forEach(function (m) {
      var e = EL[m.userData.el]; if (!e) return;
      m.updateMatrixWorld(true);
      var pos = m.geometry.getAttribute('position'), idx = m.geometry.getIndex(), nTri = (idx ? idx.count : pos.count) / 3;
      var pt = function (i) { v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld); return [v.x, -v.z, v.y]; }; // three -> CAD
      var tris = [];
      for (var t = 0; t < nTri; t++) {
        var p = [pt(idx ? idx.getX(t * 3) : t * 3), pt(idx ? idx.getX(t * 3 + 1) : t * 3 + 1), pt(idx ? idx.getX(t * 3 + 2) : t * 3 + 2)];
        var nn = cross([p[1][0] - p[0][0], p[1][1] - p[0][1], p[1][2] - p[0][2]], [p[2][0] - p[0][0], p[2][1] - p[0][1], p[2][2] - p[0][2]]);
        if (Math.hypot(nn[0], nn[1], nn[2]) < 1e-9) continue;
        nn = unit(nn);
        // sign-normalise so both windings of the same plane share a key
        var f = Math.abs(nn[0]) > 1e-6 ? nn[0] : Math.abs(nn[1]) > 1e-6 ? nn[1] : nn[2]; if (f < 0) nn = [-nn[0], -nn[1], -nn[2]];
        p.forEach(grow);
        tris.push({ p: p, n: nn, k: p.map(vkey) });
      }
      // edges -> triangles
      var edges = {};
      tris.forEach(function (tr, ti) { for (var j = 0; j < 3; j++) { var a = tr.k[j], b = tr.k[(j + 1) % 3], ek = a < b ? a + '|' + b : b + '|' + a; (edges[ek] = edges[ek] || []).push([ti, j]); } });
      // outline lines: edges that are not inside a flat surface
      Object.keys(edges).forEach(function (ek) {
        var list = edges[ek], t0 = tris[list[0][0]], flat = false;
        for (var q = 1; q < list.length; q++) if (Math.abs(dot(tris[list[q][0]].n, t0.n)) > COS_FLAT) { flat = true; break; }
        if (flat || seenEdge[ek]) return; seenEdge[ek] = 1;
        var j = list[0][1], a = t0.p[j], b = t0.p[(j + 1) % 3];
        ents.push(['LINE', 'MODEL-OUTLINE', [100, 'AcDbLine', 10, n4(a[0]), 20, n4(a[1]), 30, n4(a[2]), 11, n4(b[0]), 21, n4(b[1]), 31, n4(b[2])]]); lines++;
      });
      // planar groups -> boundary loops in OCS
      var groups = {};
      tris.forEach(function (tr) { var d = dot(tr.n, tr.p[0]); var gk = n4(Math.round(tr.n[0] * 1000) / 1000) + '/' + n4(Math.round(tr.n[1] * 1000) / 1000) + '/' + n4(Math.round(tr.n[2] * 1000) / 1000) + '/' + (Math.round(d * 100) / 100); (groups[gk] = groups[gk] || []).push(tr); });
      Object.keys(groups).forEach(function (gk) {
        var g = groups[gk], n = g[0].n, axes = ocsAxes(n), z = dot(n, g[0].p[0]);
        var to2 = function (p) { return [dot(p, axes[0]), dot(p, axes[1])]; };
        var cnt = {}, P = {};
        g.forEach(function (tr) { for (var j = 0; j < 3; j++) { var a = tr.k[j], b = tr.k[(j + 1) % 3], ek = a < b ? a + '|' + b : b + '|' + a; cnt[ek] = (cnt[ek] || 0) + 1; P[a] = tr.p[j]; } });
        var adj = {}, ok = true;
        Object.keys(cnt).forEach(function (ek) { if (cnt[ek] !== 1) return; var ab = ek.split('|'); (adj[ab[0]] = adj[ab[0]] || []).push(ab[1]); (adj[ab[1]] = adj[ab[1]] || []).push(ab[0]); });
        Object.keys(adj).forEach(function (k) { if (adj[k].length !== 2) ok = false; });
        var paths = [];
        if (ok) {
          var used = {};
          Object.keys(adj).forEach(function (s) {
            if (used[s]) return; var loop = [], prev = null, cur = s, guard = 0;
            while (!used[cur] && guard++ < 10000) { used[cur] = 1; loop.push(to2(P[cur])); var nx = adj[cur][0] !== prev ? adj[cur][0] : adj[cur][1]; prev = cur; cur = nx; }
            if (loop.length >= 3) paths.push(loop);
          });
        }
        if (!ok || !paths.length) paths = g.map(function (tr) { return tr.p.map(to2); }); // fallback: each triangle its own path
        (meshFaces[e.id] = meshFaces[e.id] || []).push({ n: n, z: z, paths: paths });
      });
    });

    // ---- hatches: one per face group per (element, activity layer) ----
    var patternCodes = function (st) {
      var sc = n4(SPACING / ISO_ANSI), o = SPACING * Math.SQRT1_2;
      if (st === 'CO') return { name: 'SOLID', solid: 1, tail: [] };
      var l45 = [53, '45.0', 43, '0.0', 44, '0.0', 45, n4(-o), 46, n4(o), 79, 0];
      if (st === 'IP') return { name: 'ANSI31', solid: 0, tail: [52, '0.0', 41, sc, 77, 0, 78, 1].concat(l45) };
      return { name: 'ANSI37', solid: 0, tail: [52, '0.0', 41, sc, 77, 0, 78, 2].concat(l45, [53, '135.0', 43, '0.0', 44, '0.0', 45, n4(-o), 46, n4(-o), 79, 0]) };
    };
    var hatch = function (layer, st, face, aci) {
      var pc = patternCodes(st);
      var d = [100, 'AcDbHatch', 10, '0.0', 20, '0.0', 30, n4(face.z), 210, n4(face.n[0]), 220, n4(face.n[1]), 230, n4(face.n[2]),
        2, pc.name, 70, pc.solid, 71, 0, 91, face.paths.length];
      face.paths.forEach(function (path) { d.push(92, 3, 72, 0, 73, 1, 93, path.length); path.forEach(function (q) { d.push(10, n4(q[0]), 20, n4(q[1])); }); d.push(97, 0); });
      d.push(75, 1, 76, 1); d = d.concat(pc.tail); d.push(98, 0);
      ents.push(['HATCH', layer, d, aci]); hcount++;
    };
    var counts = { CO: 0, IP: 0, HD: 0 };
    Object.keys(meshFaces).forEach(function (id) {
      var e = EL[id], byLayer = {};
      e.acts.forEach(function (a) { var L = ACT_LAYER[a.code]; if (L) (byLayer[L] = byLayer[L] || []).push(a.s); });
      Object.keys(byLayer).forEach(function (L) {
        var st = aggStatus(byLayer[L]); if (st === 'NS') return; counts[st]++;
        meshFaces[id].forEach(function (face) { hatch(L, st, face, st === 'HD' ? 1 : 0); });
      });
    });

    // ---- text and legend ----
    var text = function (lay, x, y, z, h, s, aci, centre) {
      s = String(s).replace(/[^\x20-\x7E]/g, '-');
      var d = [100, 'AcDbText', 10, n4(x), 20, n4(y), 30, n4(z), 40, n4(h), 1, s, 7, 'Standard'];
      if (centre) d.push(72, 1, 11, n4(x), 21, n4(y), 31, n4(z));
      d.push(100, 'AcDbText');
      ents.push(['TEXT', lay, d, aci || 0]);
      var hw = s.length * h * (centre ? 0.5 : 1); grow([x - (centre ? hw : 0), y - h, z]); grow([x + hw, y + h, z]);
    };
    LABELS.forEach(function (L) {
      if (L.kind === 'seg') text('TXT-SEGMENT', L.p.x, -L.p.z + 3, L.p.y, 3, L.text, 0, true);
      else if (L.kind === 'ch') text('TXT-CHAINAGE', L.p.x, -L.p.z - 3, L.p.y, 1.8, L.text, 0, true);
      else if (L.kind === 'dir') text('TXT-SEGMENT', L.p.x, -L.p.z, 0, 3.5, (L.p.x < 600 ? '< ' : '') + L.text.replace(/[^A-Za-z ]/g, '').trim() + (L.p.x < 600 ? '' : ' >'), 30, true);
    });
    var x0 = 448, y = 74, now = new Date(), p2 = function (n) { return (n < 10 ? '0' : '') + n; };
    var stamp = fmtD(now.getFullYear() + '-' + p2(now.getMonth() + 1) + '-' + p2(now.getDate())) + ' ' + p2(now.getHours()) + ':' + p2(now.getMinutes());
    [[4, 'AL TAAWUN STREET JN-13 STRUCTURAL UNDERPASS - 3D PROGRESS MODEL'],
     [2.2, 'Contract R2202 - Str. dwgs 690145CH-P1B-3001-JCB-STR-DRG Rev A (IFC 23-Apr-26)'],
     [2.2, 'Status cut-off: ' + (cutD() || 'not set') + '    Exported: ' + stamp],
     [1.8, 'Units: metres. X = chainage, Y+ = LHS facing Sharjah, Z = level rel. top of wall (0.00).'],
     [1.8, 'Layers: MODEL-OUTLINE = model lines; HATCH-<ACTIVITY> = progress of that activity. Turn hatch layers on one at a time.']
    ].forEach(function (r) { text('TXT-TITLE', x0, y, 0, r[0], r[1]); y -= r[0] * 1.8; });
    y -= 4;
    [['CO', 'Complete (solid)'], ['IP', 'In progress (diagonal)'], ['HD', 'On hold (red cross-hatch)']].forEach(function (r, i) {
      var bx = x0 + i * 70, sw = { n: [0, 0, 1], z: 0, paths: [[[bx, y], [bx + 6, y], [bx + 6, y + 4], [bx, y + 4]]] };
      hatch('TXT-LEGEND', r[0], sw, r[0] === 'HD' ? 1 : 0); hcount--;
      text('TXT-LEGEND', bx + 8, y + 0.9, 0, 2.2, r[1]);
    });
    text('TXT-LEGEND', x0, y - 5, 0, 1.8, 'Not started = no hatch. Hatch colour follows the activity layer. Waterproofing (base, wall, top slab) shares one layer.');

    // ---- assemble ----
    var h = HANDSEED0, body = '';
    var lineOf = function (c, val) { body += c + '\n' + val + '\n'; };
    ents.forEach(function (en) {
      lineOf(0, en[0]); lineOf(5, (h++).toString(16).toUpperCase()); lineOf(330, OWNER); lineOf(100, 'AcDbEntity'); lineOf(8, en[1]);
      if (en[3]) lineOf(62, en[3]);
      var d = en[2]; for (var i = 0; i < d.length; i += 2) lineOf(d[i], d[i + 1]);
    });
    var pad = 20;
    var R = { EXTMIN_X: ext[0], EXTMIN_Y: ext[1], EXTMIN_Z: ext[2], EXTMAX_X: ext[3], EXTMAX_Y: ext[4], EXTMAX_Z: ext[5],
      LIMMIN_X: ext[0] - pad, LIMMIN_Y: ext[1] - pad, LIMMIN_Z: 0, LIMMAX_X: ext[3] + pad, LIMMAX_Y: ext[4] + pad, LIMMAX_Z: 0,
      VC_X: (ext[0] + ext[3]) / 2, VC_Y: (ext[1] + ext[4]) / 2, VH: (ext[4] - ext[1]) * 1.3, HANDSEED: h.toString(16).toUpperCase() };
    var s = TPL.replace('@@ENTITIES@@\n', function () { return body; })
      .replace(/@@([A-Z_]+)@@/g, function (m, k) { return k in R ? (typeof R[k] === 'number' ? n4(R[k]) : R[k]) : m; })
      .replace(/\n/g, '\r\n');
    return { text: s, hatches: hcount, lines: lines, counts: counts };
  }

  function exportDxf() {
    var r = buildDxf();
    var cutIso = document.getElementById('cutoff').value, d = new Date(), p2 = function (n) { return (n < 10 ? '0' : '') + n; };
    var tag = cutIso ? 'CutOff-' + fmtD(cutIso) : 'Exported-' + fmtD(d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()));
    var blob = new Blob([r.text], { type: 'application/dxf' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'Taawun_Underpass_3D_Progress-' + tag + '.dxf';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    if (typeof toast === 'function') toast('DXF exported - ' + r.hatches + ' progress hatches, ' + r.lines + ' outline lines. Open in CAD, Save As DWG.');
  }
  window.buildDxf = buildDxf;

  var tools = document.getElementById('tools'), after = document.getElementById('t-print');
  var btn = document.createElement('button'); btn.id = 't-dxf'; btn.textContent = 'Export DXF (CAD)';
  btn.title = 'Download the 3D model with current progress as a DXF for CAD (hatched by activity; Save As DWG in CAD)';
  btn.addEventListener('click', exportDxf);
  if (tools) tools.insertBefore(btn, after ? after.nextSibling : null);
})();
